const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bucketName = "uma-music";

const testupload = async () => {
  const param = {
    Body: "testing upload",
    Key: "new2.txt",
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
