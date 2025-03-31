const Service = require("../utils/api.js");
const Utils = require("../utils/utils.js");

let resultPosts = [];
let resultComments = [];

const retrieveComments = async (postUrl, postId) => {
  let cursor = "";
  let comments = [];
  while (cursor != null) {
    try {
      const commentsResponse = await Service.retrieveComments(postId, cursor);
      if (commentsResponse.items.length === 0) {
        break;
      }
      comments.push(...commentsResponse.items);
      cursor = commentsResponse.cursor;
    } catch (error) {
      console.error("Error retrieving comments:", error.response.data);
      return;
    }
  }
  console.log(comments.length, "Comments");

  if (comments.length > 0) {
    const structuredComments = comments.map((comment) => {
      return {
        profileLink: comment.author_details.profile_url,
        fullName: comment.author,
        occupation: comment.author_details.headline,
        comment: comment.text,
        commentDate: comment.date,
        likesCount: comment.reaction_counter,
        postUrl: postUrl,
        sourceUserId: comment.author_details.id,
      };
    });

    resultComments.push(...structuredComments);
  } else {
    console.log("No comments found for postId:", postId);
  }
};

const retrievePosts = async (index, profileUrl) => {
  const { public_identifier, is_company } =
    Utils.extractPublicIdentifier(profileUrl);
  if (!public_identifier) {
    console.log("Invalid profile URL:", profileUrl);
    return;
  }
  console.log(
    "Profile",
    index + 1,
    "Public Identifier:",
    public_identifier,
    is_company
  );

  let provider_id;
  try {
    if (is_company) {
      const profile = await Service.retrieveCompanyProfile(public_identifier);
      provider_id = profile.id;
    } else {
      const profile = await Service.retrieveProfile(public_identifier);
      provider_id = profile.provider_id;
    }
  } catch (error) {
    console.log("Error retrieving profile:", error.response.data);
    return;
  }
  // console.log("Provider ID:", provider_id);

  let cursor = "";
  let monthlyPosts = [];
  while (cursor != null) {
    try {
      if (is_company) {
        const posts = await Service.retrieveCompanyMonthlyPosts(
          provider_id,
          cursor
        );
        if (posts.items.length === 0) {
          break;
        }
        monthlyPosts.push(...posts.items);
        cursor = posts.cursor;
      } else {
        const posts = await Service.retrieveMonthlyPosts(provider_id, cursor);
        if (posts.items.length === 0) {
          break;
        }
        monthlyPosts.push(...posts.items);
        cursor = posts.cursor;
      }
    } catch (error) {
      console.log("Error retrieving monthly posts:", error.response.data);
      return;
    }
  }
  console.log(monthlyPosts.length, "Monthly Posts");

  if (monthlyPosts.length > 0) {
    const structuredPosts = monthlyPosts.map((post) => {
      return {
        profileUrl: profileUrl,
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
        postId: post.social_id,
      };
    });

    resultPosts.push(...structuredPosts);

    const popularPosts = structuredPosts.filter(
      (post) => post.commentCount >= 25
    );
    console.log(popularPosts.length, "Popular Posts");

    for (const post of popularPosts) {
      await retrieveComments(post.sharedPostUrl, post.postId);
    }
  } else {
    console.log("No posts found for the profile:", profileUrl);
  }
};

exports.start = async (req, res) => {
  try {
    const { profiles } = req.body;
    console.log(profiles.length, "Profiles received");

    for (const [index, profile] of profiles.entries()) {
      await retrievePosts(index, profile);
    }

    console.log(resultPosts.length, "Posts in total");
    console.log(resultComments.length, "Comments in total");

    res.json({ resultPosts, resultComments });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
