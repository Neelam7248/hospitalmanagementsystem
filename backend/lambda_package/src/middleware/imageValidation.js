const validateImage = (mimeType) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
  ];

  if (!allowedTypes.includes(mimeType)) {
    throw new Error(
      "Only JPG and PNG images are allowed"
    );
  }

  return true;
};

module.exports = validateImage;