const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { fileTypeFromBuffer } = require("file-type");
const s3 = require("../config/s3");

const uploadToS3 = async (file, options = {}) => {
  try {
    if (!file) {
      throw new Error("No file provided.");
    }

    // Detect actual file type from file buffer
    const fileType = await fileTypeFromBuffer(file.buffer);

    if (!fileType) {
      throw new Error("Unable to detect file type.");
    }

    // Folder name (default uploads)
    const folder = options.folder || "uploads";

    // Allowed mime types
    const allowedTypes = options.allowedTypes || [];

    // Validate mime type
    if (
      allowedTypes.length > 0 &&
      !allowedTypes.includes(fileType.mime)
    ) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.originalname}`;

const fileKey = `${folder}/${fileName}`;
    // Upload command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: fileType.mime,
    });

    // Upload file
    await s3.send(command);

    // Return upload details
    return {
      originalName: file.originalname,
      fileKey,
      fileName,
      fileSize: file.size,
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      mimeType: fileType.mime,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    };
  } catch (error) {
    throw new Error(`S3 Upload Failed: ${error.message}`);
  }
};

module.exports = uploadToS3;