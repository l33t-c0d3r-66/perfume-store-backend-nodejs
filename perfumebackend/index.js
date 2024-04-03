const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const perfumeRoute = require("./routes/perfume");
const reviewRoute = require("./routes/review");
const userpreferences = require("./routes/userpreferences");
const order = require("./routes/order");
dotenv.config();

const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://perfumedatabase:Xb3gg9ogIshqBVaS@cluster0.q7lvxyr.mongodb.net/perfumedatabase"
  )
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use("/api/auth", authRoute);
app.use("/api/perfume", perfumeRoute);
app.use("/api/review", reviewRoute);
app.use("/api/userpreferences", userpreferences);
app.use("/api/order", order);
app.listen(process.env.PORT || 8080, () => {
  console.log("Backend server is running!");
});
