const { execSync } = require("child_process");

exports.handler = async () => {
  try {
    console.log("Starting Prisma migrations...");
const output = execSync("node node_modules/prisma/build/index.js migrate deploy", {      encoding: "utf8",
    });

    console.log(output);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Prisma migrations applied successfully",
        output,
      }),
    };
  } catch (error) {
    console.error("Migration failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Migration failed",
        error: error.message,
      }),
    };
  }
};