// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { jsonToExcel } from "./excel/ExcelUtils.js";
import { crawlData } from "./puppeteer/puppeteerProcess2.js";
const { basicInfoPoliticians } = require("./data/basicInfoPoliticians.json");

/* Firstly, get all people from the url of europe */
const id = "197400";
const targetUrl = "https://www.europarl.europa.eu/meps/en/full-list/all";
const baseUrl = `https://www.europarl.europa.eu/meps/en/${id}`;

crawlData(baseUrl);

/** Store people profiles into the one general json file */

/** Get link by link and when got data from page then mark
 * the link is scanned  */

/** Export to Excel file */
const jsonData = require("./data/sample.json");
const filePath = "./src/data/sample1.xlsx";

try {
  jsonToExcel(jsonData, filePath);
} catch (error) {
  console.log(error.message);
}
