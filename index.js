const fs = require("fs");
const csv = require("csv-parser");
const Service = require("./api.js");
const Utils = require("./utils.js");

// let resultPosts = [];
// let resultComments = [];

// async function saveResult() {
//   const currentDate = new Date().toISOString().split("T")[0];
//   const filePath = `./result_${currentDate}.csv`;

//   // Save data to CSV file
//   const csv = parse(resultPosts);
//   const bom = "\ufeff"; // UTF-8 BOM
//   const dataToAppend = bom + csv + "\n";

//   try {
//     fs.writeFileSync(filePath, dataToAppend, { encoding: "utf8" });
//     // console.log("CSV file saved successfully");
//   } catch (err) {
//     console.error("Error writing to CSV file:", err);
//   }
// }

// function extractPostId(url) {
//   const regex = /activity-(\d+)-/;
//   const match = url.match(regex);
//   if (match && match[1]) {
//     return match[1]; // Return the postId if found
//   } else {
//     return null; // Return null if not found
//   }
// }

// async function retrievePost(link) {
//   const postId = extractPostId(link);
//   console.log("Post ID:", postId);

//   if (!postId) {
//     console.log("Post ID not found in the URL");
//     return;
//   }

//   try {
//     const post = await Service.searchPost(postId);

//     const LINKEDIN_PERSONAL = "https://www.linkedin.com/in/";
//     const LINKEDIN_COMPANY = "https://www.linkedin.com/company/";

//     const structuredPost = {
//       profileUrl: post.author.is_company
//         ? LINKEDIN_COMPANY + post.author.public_identifier
//         : LINKEDIN_PERSONAL + post.author.public_identifier,
//       postContent: post.text,
//       likeCount: post.reaction_counter,
//       commentCount: post.comment_counter,
//       postDate: post.date,
//       postTimestamp: post.parsed_datetime,
//       sharedPostUrl: post.share_url,
//       isRepost: post.is_repost,
//       authorName: post.author.name,
//       authorCompany: post.author.is_company,
//       repostAuthorName: post.repost_content?.author?.name,
//       repostIsCompany: post.repost_content?.author?.is_company,
//       repostParsedAt: post.repost_content?.parsed_datetime,
//       repostPostedAt: post.repost_content?.date,
//     };

//     resultPosts.push(structuredPost);
//   } catch (error) {
//     console.log("Error retrieving post:", error);
//     return;
//   }
// }

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
};

async function main() {
  const profiles = await importProfiles();

  // for (const profile of profiles) {
  //   await retrievePosts(profile);
  // }

  await retrievePosts(profiles[0]);
}

main().catch((err) => console.error(err));
