const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

exports.handler = async () => {
  try {
    const email = process.env.Email;
    const password = process.env.Password;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email or Password environment variable is missing.",
        }),
      };
    }

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingAdmin) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Super Admin already exists.",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName: "Super",
        lastName: "Admin",
        email: email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Super Admin created successfully.",
      }),
    };
  } catch (error) {
    console.error("Seed error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Seed failed",
        error: error.message,
      }),
    };
  } finally {
    await prisma.$disconnect();
  }
};