import { createRequire } from "module";
const require = createRequire(import.meta.url);

const puppeteer = require("puppeteer");
import {
  getLinks,
  generateRegExp,
  getActivities,
  getPosions,
  getGeneralInfoOfPerson,
} from "./utils.js";

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
    "--proxy-server=geo-dc.floppydata.com:10080",
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

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

//** open target url, then return page */
export const crawlData = async (targetUrl) => {
  const browser = await puppeteer.launch({ ...options });
  const page = await browser.newPage();

  await page.authenticate({
    username: "IZwzYOpNDYFVzrlI",
    password: "GpNt6ipE87hJPjoH",
  });

  await page.goto(targetUrl, { timeout: 10000, waitUntil: "load" });

  // await page.waitForSelector("#presentationmep", {
  //   visible: true,
  // });
  // console.log("befor");
  await delay(1000);
  // console.log("after crawl");

  const linkHome = page.url();
  console.log(linkHome);
  const container = await page.$("#presentationmep");
  const nameTag = await container.$(".sln-member-name");
  const name = await (await nameTag.getProperty("textContent")).jsonValue();

  const statusTag = await container.$(".sln-political-group-role");
  const status = statusTag
    ? await (await nameTag.getProperty("textContent")).jsonValue()
    : "";

  const partyTag = await container.$("div.erpl_title-h3");
  const party = partyTag
    ? await (await partyTag.getProperty("textContent")).jsonValue()
    : "";

  const emailHref = await container.$(".link_email");
  const email = emailHref
    ? await (await emailHref.getProperty("href")).jsonValue()
    : "";
  const emailAddress = email ? email.split(":")[1] : "";

  const fbHref = await container.$(".link_fb");
  const fb = fbHref ? await (await fbHref.getProperty("href")).jsonValue() : "";

  const twitHref = await container.$(".link_twitt");
  const twitt = twitHref
    ? await (await twitHref.getProperty("href")).jsonValue()
    : "";

  const instagramHref = await container.$(".link_instagram");
  const instagram = instagramHref
    ? await (await instagramHref.getProperty("href")).jsonValue()
    : "";

  const websiteHref = await container.$(".link_website");
  const website = websiteHref
    ? await (await websiteHref.getProperty("href")).jsonValue()
    : "";

  const youtubeHref = await container.$(".link_youtube");
  const youtube = youtubeHref
    ? await (await youtubeHref.getProperty("href")).jsonValue()
    : "";

  const linkedinHref = await container.$(".link_linkedin");
  const linkedin = linkedinHref
    ? await (await linkedinHref.getProperty("href")).jsonValue()
    : "";

  const birthDate = await container.$(".sln-birth-date");
  const birthDateText = birthDate
    ? await (await birthDate.getProperty("textContent")).jsonValue()
    : "";

  const birthPlace = await container.$(".sln-birth-place");
  const birthPlaceText = birthPlace
    ? await (await birthPlace.getProperty("textContent")).jsonValue()
    : "";

  const positions = await getPosions(page);
  const activities = await getActivities(page);
  // const generalData = await getGeneralInfoOfPerson(page);

  // const personalProfile = {
  //   Name: generalData.Name,
  //   Status: generalData.Status,
  //   Party: generalData.Party,
  //   Email: generalData.Email,
  //   Facebook: generalData.Facebook,
  //   Twitter: generalData.Twitter,
  //   Instagram: generalData.Instagram,
  //   Website: generalData.Website,
  //   Youtube: generalData.Youtube,
  //   LinkedIn: generalData.LinkedIn,
  //   birthDate: generalData.birthDate,
  //   birthPlace: generalData.birthPlace,
  //   positions: positions,
  //   activities: activities,
  //   Link: generalData.Link,
  // };

  const personalProfile = {
    Name: name,
    Status: status,
    Party: party,
    Email: emailAddress,
    FaceboPk: fb,
    Twitter: twitt,
    Instagra: instagram,
    Website: website,
    Youtube: youtube,
    LinkedIn: linkedin,
    birthDate: birthDateText,
    birthPlace: birthPlaceText,
    positions: positions,
    activities: activities,
    Link: linkHome,
  };

  await page.close();
  await browser.close();

  return personalProfile;
};
