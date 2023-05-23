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
  const text = await subContainer.evaluate(() =>
    Array.from(document.querySelectorAll(".erpl_meps-status"), (element) =>
      // getText(element)
      {
        const title = document.querySelectorAll(".erpl_title-h4");
        return title.textContent;
      }
    )
  );

  console.log(text[0]);
  console.log(text[1]);
  console.log(text[2]);
};

const getText = (element) => {
  const title = element.querySelectorAll(".erpl_title-h4");
  console.log(title);
};
