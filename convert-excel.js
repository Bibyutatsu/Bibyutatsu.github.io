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
    console.log(JSON.stringify(jsonData, null, 2));
}

// Write to JS file for browser use
const jsContent = `// Auto-generated from ResumeAssets.xlsx
// Last updated: ${new Date().toISOString()}
const portfolioData = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync('js/data.js', jsContent);
console.log('\n\nGenerated js/data.js');
