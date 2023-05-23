import {createRequire} from "module";
const require = createRequire(import.meta.url);

const XLSX = require("xlsx");

export const jsonToExcel = (jsonData, filePath, nameSheet = "Sheet1") => {
          const worksheet = XLSX.utils.json_to_sheet(jsonData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, nameSheet);
          XLSX.writeFile(workbook, filePath);
};
