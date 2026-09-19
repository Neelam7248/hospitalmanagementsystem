const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

const authToken = require("../src/utils/authToken");

const JWT_SECRET = process.env.JWT_SECRET;


// ======================================================
// Helper: Response
// ======================================================

const response = (statusCode, data) => {
  return {
    statusCode,

    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    },

    body: JSON.stringify(data),
  };
};


// ======================================================
// Helper: Parse Body
// ======================================================

const getBody = (event) => {
  if (!event.body) {
    return {};
  }

  if (typeof event.body === "string") {
    return JSON.parse(event.body);
  }

  return event.body;
};


// ======================================================
// REGISTER
// POST /api/v1/auth/register
// ======================================================

const registerUser = async (event) => {
  try {
    const body = getBody(event);

    const {
      firstName,
      lastName,
      email,
      password,
      role,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role
    ) {
      return response(400, {
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return response(400, {
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        profileImage: null,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return response(201, {
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return response(500, {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ======================================================
// SIGN IN
// POST /api/v1/auth/signin
// ======================================================

const signIn = async (event) => {
  try {
    const body = getBody(event);

    const {
      email,
      password,
    } = body;

    if (!email || !password) {
      return response(400, {
        success: false,
        message: "Please send all the required fields",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return response(404, {
        success: false,
        message:
          "Email is not registered. Please signup first.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatch) {
      return response(401, {
        success: false,
        message:
          "Password is incorrect. Please try again.",
      });
    }

    const token = JWT.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return response(200, {
      success: true,
      message: "Signin Successful",

      token,

      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
        profileImage: existingUser.profileImage,
      },
    });

  } catch (error) {
    console.error("SIGNIN ERROR:", error);

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// GET PROFILE
// GET /api/v1/auth/profile
// ======================================================

const getProfile = async (event) => {
  try {
    const userId = event.user.userId;

    const profile = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return response(404, {
        success: false,
        message: "No profile found",
      });
    }

    return response(200, {
      success: true,
      message: "Profile fetched successfully",
      profile,
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE PROFILE
// PUT /api/v1/auth/profile
// ======================================================

const updateProfile = async (event) => {
  try {
    const userId = event.user.userId;

    const body = getBody(event);

    const {
      firstName,
      lastName,
    } = body;

    if (!firstName || !lastName) {
      return response(400, {
        success: false,
        message: "Please fill all the fields",
      });
    }

    const profile = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        firstName,
        lastName,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return response(200, {
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// CHANGE PASSWORD
// PUT /api/v1/auth/password
// ======================================================

const passwordChange = async (event) => {
  try {
    const userId = event.user.userId;

    const body = getBody(event);

    const {
      oldPassword,
      newPassword,
    } = body;

    if (!oldPassword || !newPassword) {
      return response(400, {
        success: false,
        message: "Please provide both passwords",
      });
    }

    const oldUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        password: true,
      },
    });

    if (!oldUser) {
      return response(404, {
        success: false,
        message: "No user found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      oldUser.password
    );

    if (!isMatch) {
      return response(400, {
        success: false,
        message: "Old password did not match",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
      },
    });

    return response(200, {
      success: true,
      message: "Password changed successfully",
      user,
    });

  } catch (error) {
    console.error("PASSWORD CHANGE ERROR:", error);

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// CHANGE EMAIL
// PUT /api/v1/auth/email
// ======================================================

const changeEmail = async (event) => {
  try {
    const userId = event.user.userId;

    const body = getBody(event);

    const {
      newEmail,
      password,
    } = body;

    if (!newEmail || !password) {
      return response(400, {
        success: false,
        message:
          "New email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return response(404, {
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return response(401, {
        success: false,
        message: "Incorrect password",
      });
    }

    if (user.email === newEmail) {
      return response(400, {
        success: false,
        message:
          "New email cannot be the same as current email",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
    });

    if (existingUser) {
      return response(409, {
        success: false,
        message: "Email is already registered",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        email: newEmail,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response(200, {
      success: true,
      message: "Email updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("CHANGE EMAIL ERROR:", error);

    return response(500, {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ======================================================
// MAIN LAMBDA HANDLER
// ======================================================

const handler = async (event) => {
  try {

    const method =
      event.requestContext?.http?.method;

    const path =
      event.rawPath;

    console.log("HTTP METHOD:", method);
    console.log("PATH:", path);


    // ==================================================
    // CORS
    // ==================================================

    if (method === "OPTIONS") {
      return response(200, {
        success: true,
      });
    }


    // ==================================================
    // PUBLIC ROUTES
    // ==================================================

    if (
      method === "POST" &&
      path === "/api/v1/auth/signin"
    ) {
      return await signIn(event);
    }

    if (
      method === "POST" &&
      path === "/api/v1/auth/register"
    ) {
      return await registerUser(event);
    }


    // ==================================================
    // PROTECTED ROUTES
    // ==================================================

    const authResult = authToken(event);

    // authToken already generated 401 response
    if (authResult.statusCode) {
      return authResult;
    }


    // ==================================================
    // GET PROFILE
    // ==================================================

    if (
      method === "GET" &&
      path === "/api/v1/auth/profile"
    ) {
      return await getProfile(event);
    }


    // ==================================================
    // UPDATE PROFILE
    // ==================================================

    if (
      method === "PUT" &&
      path === "/api/v1/auth/profile"
    ) {
      return await updateProfile(event);
    }


    // ==================================================
    // CHANGE PASSWORD
    // ==================================================

    if (
      method === "PUT" &&
      path === "/api/v1/auth/password"
    ) {
      return await passwordChange(event);
    }


    // ==================================================
    // CHANGE EMAIL
    // ==================================================

    if (
      method === "PUT" &&
      path === "/api/v1/auth/email"
    ) {
      return await changeEmail(event);
    }


    // ==================================================
    // ROUTE NOT FOUND
    // ==================================================

    return response(404, {
      success: false,
      message: "Auth route not found",
    });

  } catch (error) {

    console.error(
      "AUTH LAMBDA ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  handler,
};