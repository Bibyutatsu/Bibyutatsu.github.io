const XLSX = require('/opt/homebrew/lib/node_modules/xlsx');
const fs = require('fs');

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
    data.Experience.forEach(exp => {
        console.log(`   - ${exp.company} / ${exp.role}: ${exp.projects.length} projects`);
    });

    // Remove raw sheets from output (keep only processed data)
    delete data.WorkRoles;
    delete data.WorkProjects;
}

// =============================================
// Process Internships Data
// =============================================
if (data.Internships) {
    console.log('\n=== Processing Internships ===');

    // Normalize field names for consistency
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
// Write to JS file for browser use
// =============================================
const jsContent = `// Auto-generated from ResumeAssets.xlsx
// Last updated: ${new Date().toISOString()}
const portfolioData = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync('js/data.js', jsContent);
console.log('\n\n✅ Generated js/data.js');
