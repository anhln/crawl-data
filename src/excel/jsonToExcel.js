const XLSX = require("xlsx");

// Read JSON file
const jsonData = require("../data/sample.json");

// Convert JSON to Worksheet
const worksheet = XLSX.utils.json_to_sheet(jsonData);

// Create Workbook and Add Worksheet
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// Save Workbook to File
XLSX.writeFile(workbook, "./src/data/sample.xlsx");
