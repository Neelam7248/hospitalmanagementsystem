const Busboy = require("busboy");

const parseMultipart = (event) => {
  return new Promise((resolve, reject) => {
    try {
      const contentType =
        event.headers?.["content-type"] ||
        event.headers?.["Content-Type"];

      if (!contentType) {
        return reject(
          new Error("Content-Type header is missing")
        );
      }

      const busboy = Busboy({
        headers: {
          "content-type": contentType,
        },

        limits: {
          fileSize: 10 * 1024 * 1024, // 10 MB
          files: 5,
        },
      });

      const fields = {};
      const files = {};

      busboy.on("field", (name, value) => {
        fields[name] = value;
      });

      busboy.on(
        "file",
        (name, file, info) => {
          const {
            filename,
            encoding,
            mimeType,
          } = info;

          const chunks = [];

          file.on("data", (chunk) => {
            chunks.push(chunk);
          });

          file.on("limit", () => {
            reject(
              new Error(
                `File "${name}" exceeds 10 MB limit`
              )
            );
          });

          file.on("end", () => {
            const buffer = Buffer.concat(chunks);

            files[name] = {
              buffer,
              originalname: filename,
              mimetype: mimeType,
              encoding,
              size: buffer.length,
            };
          });
        }
      );

      busboy.on("error", (error) => {
        reject(error);
      });

      busboy.on("finish", () => {
        resolve({
          fields,
          files,
        });
      });

      // API Gateway base64 encoded body
      const body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : Buffer.from(event.body || "", "utf8");

      busboy.end(body);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = parseMultipart;