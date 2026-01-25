const XLSX = require('/opt/homebrew/lib/node_modules/xlsx');
const fs = require('fs');
const https = require('https');

// Helper to fetch JSON
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    // Read the Excel file
    const workbook = XLSX.readFile('files/ResumeAssets.xlsx');

    // Object to hold all data
    const data = {};

    // Convert each sheet to JSON
    for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const cleanName = sheetName.replace(/[^a-zA-Z]/g, '');
        data[cleanName] = jsonData;
        console.log(`\n=== ${sheetName} ===`);
        console.log(`   ${jsonData.length} rows`);
    }

    // =============================================
    // Process Experience Data (Join WorkRoles + WorkProjects)
    // =============================================
    if (data.WorkRoles && data.WorkProjects) {
        console.log('\n=== Processing Experience (Join) ===');

        // Create a map of RoleId -> projects
        const projectsByRole = {};
        data.WorkProjects.forEach(project => {
            const roleId = project.RoleId;
            if (!projectsByRole[roleId]) {
                projectsByRole[roleId] = [];
            }
            projectsByRole[roleId].push({
                title: project.ProjectTitle,
                description: project.ProjectDescription
            });
        });

        // Join roles with their projects (preserve Excel order)
        data.Experience = data.WorkRoles.map(role => ({
            company: role.Company,
            logoPath: role.LogoPath,
            role: role.Role,
            dateRange: role.DateRange,
            projects: projectsByRole[role.RoleId] || []
        }));

        console.log(`   Created ${data.Experience.length} experience entries`);

        // Remove raw sheets from output (keep only processed data)
        delete data.WorkRoles;
        delete data.WorkProjects;
    }

    // =============================================
    // Process Internships Data
    // =============================================
    if (data.Internships) {
        console.log('\n=== Processing Internships ===');
        data.Internships = data.Internships.map(intern => ({
            company: intern.Company,
            role: intern.Role,
            dateRange: intern.DateRange,
            projectTitle: intern.ProjectTitle,
            projectDescription: intern.ProjectDescription
        }));
        console.log(`   ${data.Internships.length} internships`);
    }

    // =============================================
    // Process Credly Data (Fetch from URLs)
    // =============================================
    if (data.Credly && data.Credly.length > 0) {
        console.log('\n=== Processing Credly ===');
        const badgeList = [];

        for (const row of data.Credly) {
            // Find the URL (assuming it's in a column named ProfileURL or the first column)
            const url = Object.values(row).find(val => typeof val === 'string' && val.startsWith('http'));

            if (url) {
                console.log(`   Fetching badges from: ${url}`);
                try {
                    const response = await fetchJson(url);
                    const badges = response.data || response; // Handle {data: []} or []

                    if (Array.isArray(badges)) {
                        console.log(`   Found ${badges.length} badges`);
                        badges.forEach(b => {
                            badgeList.push({
                                title: b.badge_template.name,
                                badgeUrl: `https://www.credly.com/badges/${b.id}/public_url`,
                                imageUrl: b.image_url
                            });
                        });
                    }
                } catch (err) {
                    console.error(`   Error fetching ${url}:`, err.message);
                }
            }
        }

        // Replace the raw Credly sheet data with the fetched badges
        data.Credly = badgeList;
        console.log(`   Total badges processed: ${data.Credly.length}`);
    }

    // =============================================
    // Write to JS file for browser use
    // =============================================
    const jsContent = `// Auto-generated from ResumeAssets.xlsx
// Last updated: ${new Date().toISOString()}
const portfolioData = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync('js/data.js', jsContent);
    console.log('\n\n✅ Generated js/data.js');
}

main().catch(console.error);
