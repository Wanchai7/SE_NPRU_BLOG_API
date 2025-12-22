const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.register = async (req, res) => {
  // แก้ไข: ต้องรับค่าจาก req.body ไม่ใช่ req เฉยๆ
  const { username, password } = req.body;

  if (!username || !password) {
    // เพิ่ม return เพื่อหยุดการทำงานหากเงื่อนไขเป็นจริง
    return res.status(400).send({ message: "กรุณากรอก ยูชเซอร์ และ รหัสผ่าน" });
  }

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res
      .status(400)
      .send({ message: "This username is already existed" });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // ไม่จำเป็นต้องประกาศ user ในตัวแปรถ้าไม่ได้ใช้ต่อ แต่ create เก็บไว้ได้
    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.send({
      message: "สมัครสมาชิกสำเร็จ",
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.login = async (req, res) => {
  // แก้ไข: Syntax การดึงค่าผิด ต้องดึงค่าออกมาก่อนแล้วค่อยเช็ค if
  //นำข้อมูลมาจาก req.body
  const { username, password } = req.body;
//เช็คว่าใส่ username และ รหัสผ่าน ใส่มาครบมั้ย
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Please provide username and password" });
  }
//เช็คว่า username ที่ส่งมาตรงกับ username ในฐานข้อมูลมั้ย
  try {
    // const userDoc = await UserModel.findOne({ username:username //ถ้าเหมือนกันให้ลดรูปเหลือแค่ตัวเดียว});
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordMatched = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Login successfully
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      // แก้ไข: id(err) เป็น if(err)
      if (err) {
        return res
          .status(500)
          .send({ message: "Internal server error: Authentication failed" });
      }
      // token generation
      res.send({
        message: "เข้าสู่ระบบสำเร็จ",
        id: userDoc._id,
        username,
        accessToken: token,
      });
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: error.message || "Some errors occurred while logging in user",
      });
  }
};
