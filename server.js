const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv").config();
const path = require("path");
const connectDB = require("./db");
const Post = require("./models/Post");

// Enter copied or downloaded access ID and secret key here
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const REGION = process.env.REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;

// AWS.config.update({ region: REGION });

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  apiVersion: "2006-03-01",
  // region: REGION,
});

// Implementing cors
app.use(cors());
// connect to database
connectDB();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));


// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    metadata(req, file, cb) {
      console.log("file", file);
      cb(null, {
        fieldName: file.fieldname,
        postDescription: req.headers.postdata,
      });
    },
    key(req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
});

app.post("/handlePost", upload.single("photo"), async (req, res, next) => {
  console.log("requesting file", req.file);
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a image");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    try {
      let post = new Post({
        postDescription: req.headers.postdata,
        imageUrl: file.location,
      });
      await post.save();
      res.json(post);
    } catch (err) {
      res.status(500).send("Server Error");
      console.error(err.message);
    }
  }
});

// Create the parameters for calling listObjects
let bucketParams = {
  Bucket: BUCKET_NAME,
};

app.get("/all_images", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Listen to Port to 5000");
});
