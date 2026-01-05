const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const DB_URL = process.env.DB_URL;

app.use(cors({ origin: BASE_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({storage: multer.memoryStorage()});

// ข้อความแสดงการทดสอบหน้าเว็บว่า npm run dev ขึ้น
app.get("/", (req, res) => {
  res.send("<h1>Welcome to SE NPRU Blog Restful API</h1>");
});

if (!DB_URL) {
  console.error("DB URL is missing. please set it in your .env file");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
}
// use Router path หรือ URL http://localhost:5000/api/v1/user/...
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

// เชื่อมต่อหน้าเว็บหรือการเชื่อม frontend
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
