import { createRequire } from "module";
const require = createRequire(import.meta.url);

import pLimit from "p-limit";

const puppeteer = require("puppeteer");
import { crawlData } from "./puppeteerProcess2.js";

async function runPuppeteerInstance(options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(options.url);

  //process in here

  await browser.close();
}

export async function runMultiplePuppeteerInstances(links) {
  const batchSize = 1;
  const totalBatches = Math.ceil(links.length / batchSize);
  const results = [];

  // way 2
  const limit = pLimit(batchSize);

  //   for (let index = 0; index < totalBatches; index++) {
  //     const batch = links.slice(index * batchSize, (index + 1) * batchSize);
  //     const puppeteerPromises = [];

  //     for (const url of batch) {
  //       const promise = crawlData(url);
  //       puppeteerPromises.push(promise);
  //     }

  //     const multiProfiles = await Promise.all(puppeteerPromises);
  //     results.push(...multiProfiles);
  //   }
  const puppeteerPromises = links.map((url) => limit(() => crawlData(url)));
  const multiProfiles = await Promise.all(puppeteerPromises);
  results.push(...multiProfiles);
  return results;
}

async function manualPuppeteer() {
  const sampleProfiles = basicInfoPoliticians.slice(0, 100);
  const sampleProfiles1 = basicInfoPoliticians.slice(100, 200);
  const sampleProfiles2 = basicInfoPoliticians.slice(200, 300);
  const sampleProfiles3 = basicInfoPoliticians.slice(300, 400);
  const sampleProfiles4 = basicInfoPoliticians.slice(400, 500);
  const sampleProfiles5 = basicInfoPoliticians.slice(500, 600);
  const sampleProfiles6 = basicInfoPoliticians.slice(600, 700);
  const sampleProfiles7 = basicInfoPoliticians.slice(700, 705);

  let count = 0;
  for (const profile of sampleProfiles7) {
    const targetUrl = `${baseUrl}/${profile.id}`;
    const profileCrawled = await crawlData(targetUrl);
    const profileStandards = {
      Name: profile.fullname,
      Group: profile.politicalgroup,
      Status: profileCrawled.Status,
      Country: profile.country,
      Party: profileCrawled.Party,
      Email: profileCrawled.Email,
      Website: profileCrawled.Website,
      Facebook: profileCrawled.Facebook,
      Twitter: profileCrawled.Twitter,
      Youtube: profileCrawled.Youtube,
      Insta: profileCrawled.Instagram,
      LinkedIn: profileCrawled.LinkedIn,
      "Date of Birth": profileCrawled.birthDate,
      "Location of Birth": profileCrawled.birthPlace,
      Positions: profileCrawled.positions,
      Activities: profileCrawled.activities,
      Link: profileCrawled.Link,
    };
    resultProiles.push(profileStandards);
    count++;

    console.log(count);
  }
}
