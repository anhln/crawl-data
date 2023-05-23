import { createRequire } from "module";
const require = createRequire(import.meta.url);

const puppeteer = require("puppeteer");
import { getLinks, generateRegExp, getPosions, getPosions1 } from "./utils.js";

// const input = JSON.parse(process.argv[2]);
const input = {
  url: "https://google.com",
  search:
    "https://dev.to/anhln/how-to-use-pinia-orm-in-vue-3-vuetify-3-typescript",
  relatedLink: "https://github.com/anhln/vue3-vite-ts-pinia-orm-todo",
};
const options = {
  headless: false,
  args: [
    "--disable-webgl",
    "--no-sandbox",
    "--enable-features=NetworkService",
    "--ignore-certificate-errors",
  ],
};

export const runPuppeteer = async () => {
  const browser = await puppeteer.launch({ ...options });
  const page = await browser.newPage();

  const searchQuery = input.search;
  const relatedLinks = input.relatedLinks;

  await page.goto(input.url);

  try {
    await page.type('textarea[name="q"]', searchQuery);
  } catch (error) {
    await page.type('input[name="q"]', searchQuery, 100);
    console.log(error);
  }

  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  try {
    const hrefs = await getLinks(page);
    const links = hrefs.filter(
      (href) =>
        href.match(generateRegExp(`https://${searchQuery}`)) ||
        href.match(generateRegExp(`http://${searchQuery}`))
    );

    // for (const link of links) {
    const link = links[0];
    if (link) {
      try {
        await page.goto(link);
        await page.waitForNavigation;

        for (const relatedLink of relatedLinks) {
          // await page.goto()
          const hrefs = await getLinks(page);
          const sublinks = hrefs.filter(
            (href) =>
              href.match(generateRegExp(`https://${relatedLink.name}`)) ||
              href.match(generateRegExp(`http://${relatedLink.name}`))
          );
          for (const sublink of sublinks) {
            try {
              await Promise.all([
                page.goto(sublink),
                page.waitForNavigation,
                new Promise((r) => setTimeout(r, 2000)),
              ]);
            } catch (error) {
              console.log(error.message);
            }
          }
        }
        // TODO: should open the first link and open related links
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }

  try {
    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
};

//** open target url, then return page */
export const crawlData = async (targetUrl) => {
  const browser = await puppeteer.launch({ ...options });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  // await page.waitForNavigation();
  // const container = await page.evaluate(() => {
  //   const presentation = document.evaluate(
  //     "//div[@id='presentationmep']",
  //     document,
  //     null,
  //     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  //     null
  //   );
  //   const hrefs = [];
  //   for (let i = 0; i < presentation.snapshotLength; i++) {
  //     const link = presentation.snapshotItem(i);
  //     hrefs.push(link.href);
  //   }

  //   return hrefs;
  // });
  const linkHome = await page.url();
  const container = await page.$("#presentationmep");
  const name = await container.$(".sln-member-name");
  const text = await (await name.getProperty("textContent")).jsonValue();
  console.log("Text is: " + text);

  const emailHref = await container.$(".link_email");
  const email = await (await emailHref.getProperty("href")).jsonValue();
  const emailAddress = email ? email.split(":")[1] : "";
  console.log("EMAIL is: " + emailAddress);

  const fbHref = await container.$(".link_fb");
  const fb = await (await fbHref.getProperty("href")).jsonValue();
  console.log("FB is: " + fb);

  const twitHref = await container.$(".link_fb");
  const twitt = await (await twitHref.getProperty("href")).jsonValue();
  console.log("twitt is: " + twitt);

  const instagramHref = await container.$(".link_fb");
  const instagram = await (await instagramHref.getProperty("href")).jsonValue();
  console.log("instagram is: " + instagram);

  const websiteHref = await container.$(".link_fb");
  const website = await (await websiteHref.getProperty("href")).jsonValue();
  console.log("website is: " + website);

  const birthDate = await container.$(".sln-birth-date");
  const birthDateText = await (
    await birthDate.getProperty("textContent")
  ).jsonValue();
  console.log("birthDateText is: " + birthDateText ? birthDateText.trim() : "");
  // sln-birth-place

  const birthPlace = await container.$(".sln-birth-place");
  const birthPlaceText = await (
    await birthPlace.getProperty("textContent")
  ).jsonValue();
  console.log(
    "birthPlaceText is: " + birthPlaceText ? birthPlaceText.trim() : ""
  );

  const position = await getPosions1(page);

  new Promise((r) => setTimeout(r, 4000));

  // await page.close();
  // await browser.close();
};
