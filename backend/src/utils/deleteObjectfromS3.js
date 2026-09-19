const {
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = require("../config/s3");

const deleteFromS3 = async (fileKey) => {
  if (!fileKey) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
};

module.exports = deleteFromS3;