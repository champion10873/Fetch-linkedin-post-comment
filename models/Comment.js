const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    profileLink: String,
    fullName: String,
    occupation: String,
    comment: String,
    commentDate: String,
    likesCount: Number,
    postUrl: String,
    sourceUserId: String
});

module.exports = Comment = mongoose.model("comment", CommentSchema);