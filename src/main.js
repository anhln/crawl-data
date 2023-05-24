// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { jsonToExcel } from "./excel/ExcelUtils.js";
import { runMultiplePuppeteerInstances } from "./puppeteer/multiInstances.js";

const basicInfoPoliticians = require("./data/basicInfoPoliticians.json");
const filePathOutput = "./src/data/fullProfileResults.xlsx";

/* Firstly, get all people from the url of europe */
const id = "197400";
const targetUrl = "https://www.europarl.europa.eu/meps/en/full-list/all";
const baseUrl = `https://www.europarl.europa.eu/meps/en/`;

// const profile = await crawlData(`${baseUrl}${id}`);

/** Store people profiles into the one general json file */

const links = basicInfoPoliticians.map((element) => `${baseUrl}${element.id}`);
const sublinks = links.slice(0, 10);

const fullInfo = await runMultiplePuppeteerInstances(links);
/** Get link by link and when got data from page then mark
 * the link is scanned  */
// console.log("fullInfo", fullInfo);

/** Export to Excel file */
try {
  jsonToExcel(fullInfo, filePathOutput);
} catch (error) {
  console.log(error.message);
}
