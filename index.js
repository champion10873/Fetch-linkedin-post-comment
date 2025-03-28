const fs = require("fs");
const csv = require("csv-parser");
const { parse } = require("json2csv");
const Service = require("./api.js");
const Utils = require("./utils.js");

let resultPosts = [];
// let resultComments = [];

async function saveResult() {
  const currentDate = new Date().toISOString().split("T")[0];
  const filePath = `./posts_${currentDate}.csv`;

  // Save data to CSV file
  const csv = parse(resultPosts);
  const bom = "\ufeff"; // UTF-8 BOM
  const dataToAppend = bom + csv + "\n";

  try {
    fs.writeFileSync(filePath, dataToAppend, { encoding: "utf8" });
    // console.log("CSV file saved successfully");
  } catch (err) {
    console.error("Error writing to CSV file:", err);
  }
}

const importProfiles = () => {
  return new Promise((resolve, reject) => {
    const profiles = [];
    fs.createReadStream("People.csv")
      .pipe(csv())
      .on("data", (row) => {
        profiles.push(row["profileUrl"]);
      })
      .on("end", () => {
        console.log("CSV file successfully processed:", profiles.length);
        resolve(profiles);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
};

const retrievePosts = async (profileUrl) => {
  const public_identifier = Utils.extractPublicIdentifier(profileUrl);
  console.log("Public Identifier:", public_identifier);

  const profile = await Service.retrieveProfile(public_identifier);
  const provider_id = profile.provider_id;
  console.log("Provider ID:", provider_id);

  let cursor = "";
  let monthlyPosts = [];
  while (cursor != null) {
    const posts = await Service.retrieveMonthlyPosts(provider_id, cursor);
    if (posts.items.length === 0) {
      break;
    }
    monthlyPosts.push(...posts.items);
    cursor = posts.cursor;
  }
  console.log(monthlyPosts.length, "Monthly Posts");

  if (monthlyPosts.length > 0) {
    monthlyPosts[0].profileUrl = profileUrl;

    const structuredPosts = monthlyPosts.map((post) => {
      return {
        profileUrl: post.profileUrl,
        postContent: post.text,
        likeCount: post.reaction_counter,
        commentCount: post.comment_counter,
        postDate: post.date,
        postTimestamp: post.parsed_datetime,
        sharedPostUrl: post.share_url,
        isRepost: post.is_repost,
        authorName: post.author.name,
        authorCompany: post.author.is_company,
        repostAuthorName: post.repost_content?.author?.name,
        repostIsCompany: post.repost_content?.author?.is_company,
        repostParsedAt: post.repost_content?.parsed_datetime,
        repostPostedAt: post.repost_content?.date,
      };
    });

    resultPosts.push(...structuredPosts);
  } else {
    console.log("No posts found for the profile:", profileUrl);
  }
};

async function main() {
  const profiles = await importProfiles();

  // for (const profile of profiles) {
  //   await retrievePosts(profile);
  // }

  await retrievePosts(profiles[0]);

  console.log(resultPosts.length, "Posts in total");
  await saveResult();
}

main().catch((err) => console.error(err));
