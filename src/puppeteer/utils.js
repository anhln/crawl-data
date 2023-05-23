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

// module.exports = { getLinks, generateRegExp };

export const getPosions = async (page) => {
  const subContainer = await page.$(".erpl_meps-status-list");
  const handles = await subContainer.$$eval(".erpl_meps-status", (divs) => {
    divs.map((el) => el);
  });
  console.log(handles);
  // for (const handle of handles) {
  //   console.log(handle);
  //   const position = await handle.$(".erpl_title-h4");
  //   if (position) {
  //     const text = await (
  //       await position.getProperty("textContent")
  //     ).jsonValue();
  //     console.log("position is: " + text);
  //     return text;
  //   }
  // }
  // await handle.click();
};

export const getPosions1 = async (page) => {
  const subContainer = await page.$(".erpl_meps-status-list");
  // const handles = await subContainer.$$eval(".erpl_meps-status",
  const elements = await subContainer.$$(".erpl_meps-status");

  // Loop through the elements and extract desired information
  for (const element of elements) {
    const textH4 = await element.$(".erpl_title-h4");
    const text = await (await textH4.getProperty("textContent")).jsonValue();
    // const text = await page.evaluate((el) => el.textContent, element);
    console.log(text);
  }
};

const getText = (element) => {
  const title = element.querySelectorAll(".erpl_title-h4");
  console.log(title);
};
