const Service = require("./api.js");
const fs = require("fs");
const { parse } = require("json2csv");
const csv = require("csv-parser");

let completedPosts = [];

async function saveResult() {
  const currentDate = new Date().toISOString().split("T")[0];
  const filePath = `./result_${currentDate}.csv`;

  // Save data to CSV file
  const csv = parse(completedPosts);
  const bom = "\ufeff"; // UTF-8 BOM
  const dataToAppend = bom + csv + "\n";

  try {
    fs.writeFileSync(filePath, dataToAppend, { encoding: "utf8" });
    // console.log("CSV file saved successfully");
  } catch (err) {
    console.error("Error writing to CSV file:", err);
  }
}

function extractPostId(url) {
  const regex = /activity-(\d+)-/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1]; // Return the postId if found
  } else {
    return null; // Return null if not found
  }
}

async function retrievePost(link) {
  const postId = extractPostId(link);
  console.log("Post ID:", postId);

  if (!postId) {
    console.log("Post ID not found in the URL");
    return;
  }

  try {
    const post = await Service.searchPost(postId);

    const LINKEDIN_PERSONAL = "https://www.linkedin.com/in/";
    const LINKEDIN_COMPANY = "https://www.linkedin.com/company/";

    const structuredPost = {
      profileUrl: post.author.is_company
        ? LINKEDIN_COMPANY + post.author.public_identifier
        : LINKEDIN_PERSONAL + post.author.public_identifier,
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

    completedPosts.push(structuredPost);
  } catch (error) {
    console.log("Error retrieving post:", error);
    return;
  }
}

async function main() {
  // Initialize
  const posts = [];
  fs.createReadStream("Posts.csv")
    .pipe(csv())
    .on("data", (row) => {
      posts.push(row["postUrl"]);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed:", posts.length);
      for (const post of posts) {
        await retrievePost(post);
      }
      console.log("Total posts:", completedPosts.length);

      await saveResult();
    });
}

main().catch((err) => console.error(err));
