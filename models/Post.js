const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postDescription: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
