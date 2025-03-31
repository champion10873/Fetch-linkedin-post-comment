const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  profileUrl: String,
  postContent: String,
  likeCount: Number,
  commentCount: Number,
  postDate: String,
  postTimestamp: String,
  sharedPostUrl: String,
  isRepost: Boolean,
  authorName: String,
  authorCompany: Boolean,
  repostAuthorName: String,
  repostIsCompany: Boolean,
  repostParsedAt: String,
  repostPostedAt: String,
  postId: String,
});

module.exports = Post = mongoose.model("post", PostSchema);