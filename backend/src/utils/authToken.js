const JWT = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authToken = (event) => {
  const authHeader =
    event.headers?.authorization ||
    event.headers?.Authorization;

  // Token not provided
  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "No authorization token provided",
      }),
    };
  }

  // Invalid authorization format
  if (!authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "Invalid authorization header",
      }),
    };
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "Token not provided",
      }),
    };
  }

  try {
    const decodedUser = JWT.verify(token, JWT_SECRET);

    event.user = {
      userId: decodedUser.userId,
      email: decodedUser.email,
      role: decodedUser.role,
    };

    return event.user;

  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message:
          error.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token",
      }),
    };
  }
};

module.exports = authToken;