const { PrismaClient } =require( "@prisma/client");
const bcrypt =require("bcrypt");
require("dotenv").config();

const email=process.env.Email;
const password=process.env.Password;
const prisma = new PrismaClient();

async function main() {
  const existingSuperAdmin = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingSuperAdmin) {
    console.log("Super Admin already exists.");
    return;
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

  console.log("Super Admin created successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });