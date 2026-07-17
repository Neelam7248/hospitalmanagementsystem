const app=require("./app");
const prisma =require( "./config/prisma.js");

require ("dotenv").config();
const PORT=process.env.PORT;
prisma
  .$connect()
  .then(() => {
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log("Server Started");
    });
  })
  .catch((error) => {
    console.log(error);
  });