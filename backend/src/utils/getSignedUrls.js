const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");

const generateSignedUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: 300, // 5 minutes
  });
};

module.exports = generateSignedUrl;