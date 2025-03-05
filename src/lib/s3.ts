const textfile = require("fs").readFileSync("test.txt");

require("dotenv").config();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bucketName = "uma-music";

const testupload = async () => {
  const param = {
    Body: "This is a test file",
    Key: "new.txt",
    Bucket: bucketName,
  };
  try {
    await s3.upload(param).promise();
    console.log("Upload Success");
  } catch (e) {
    console.log("Upload Error", e);
  }
};

testupload();
