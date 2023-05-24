export const getLinks = async (page) => {
  const result = await page.evaluate(() => {
    const linkSnapshot = document.evaluate(
      "//a[@href]",
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    const hrefs = [];
    for (let i = 0; i < linkSnapshot.snapshotLength; i++) {
      const link = linkSnapshot.snapshotItem(i);
      hrefs.push(link.href);
    }
    return hrefs;
  });
  return result;
};

export function generateRegExp(input) {
  // Escape any special characters in the input string
  const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Generate a regular expression pattern that matches the input string
  const pattern = new RegExp(escapedInput, "i");

  return pattern;
}

export const getGeneralInfoOfPerson = async (page) => {
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

  return {
    Name: name,
    Status: status,
    Party: party ? party.trim() : party,
    Email: emailAddress,
    Facebook: fb,
    Twitter: twitt,
    Instagram: instagram,
    Website: website,
    Youtube: youtube,
    LinkedIn: linkedin,
    birthDate: birthDateText ? birthDateText.trim() : "",
    birthPlace: birthPlaceText ? birthPlaceText.trim() : "",
    Link: linkHome,
  };
};

export const getPosions = async (page) => {
  let positions = "";
  try {
    const subContainer = await page.$(".erpl_meps-status-list");
    const elements = await subContainer.$$(".erpl_meps-status");

    for (const element of elements) {
      const tagH4 = await element.$(".erpl_title-h4");
      const title = await (await tagH4.getProperty("textContent")).jsonValue();
      const tagCommittees = await element.$$(".erpl_committee");
      for (const org of tagCommittees) {
        const orgName = await (
          await org.getProperty("textContent")
        ).jsonValue();

        if (title && orgName) {
          const position = `${title.trim()}, ${orgName.trim()}`;
          positions = positions ? `${positions}\n${position}` : `${position}`;
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    return positions;
  }
};

export const getActivities = async (page) => {
  let activities = "";
  try {
    const subContainer = await page.$(".erpl_meps-activities-list");
    const elements = await subContainer.$$(".t-item");

    for (const element of elements) {
      const text = await (await element.getProperty("textContent")).jsonValue();
      if (text) {
        activities = activities
          ? `${activities}\n${text.trim()}`
          : `${text.trim()}`;
      }
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    return activities;
  }
};
