const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.register = async (req, res) => {
    const {username, password} =req;
    if(!username || !password){
        res.status(400).send({message:"กรุณากรอก ยูชเซอร์ และ รหัสผ่าน",});
    }
    const existingUser = await UserModel.findOne({ username });
    if(existingUser){
        return res.status(400).send({message: "This username is already existed",});
    }
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt);
        const user = await UserModel.create({
            username,
            password:hashedPassword,
        });
        res.send({
            message:"สมัครสมาชิกสำเร็จ",
        })
    } catch (error) {
        res.status(500).send({message: error.message || "Some errors occurred while registering a new user",});
    }
};

exports.login =async (req, res) => {

};

// const UserModel = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const secret = process.env.SECRET;

// // --- REGISTER ---
// exports.register = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // 1. ตรวจสอบว่ามี User นี้อยู่แล้วหรือไม่ (Optional แต่แนะนำ)
//     const existingUser = await UserModel.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // 2. เข้ารหัส Password (Hash)
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 3. สร้าง User ใหม่
//     const userDoc = await UserModel.create({
//       username,
//       password: hashedPassword,
//     });

//     // 4. ส่งข้อมูลกลับ (ไม่ควรส่ง password กลับไป)
//     res.json({ id: userDoc._id, username: userDoc.username });
//   } catch (e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// };

// // --- LOGIN ---
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // 1. ค้นหา User จาก Username
//     const userDoc = await UserModel.findOne({ username });

//     // ถ้าไม่เจอ User
//     if (!userDoc) {
//       return res.status(400).json("User not found");
//     }

//     // 2. ตรวจสอบ Password (เทียบค่าที่รับมา กับค่าที่ Hash ไว้ใน DB)
//     const passOk = await bcrypt.compare(password, userDoc.password);

//     // ถ้า Password ไม่ตรง
//     if (!passOk) {
//       return res.status(400).json("Wrong credentials");
//     }

//     // 3. ถ้าถูกต้อง ให้สร้าง JWT Token
//     // payload คือข้อมูลที่จะฝังใน token (เช่น username, id)
//     jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
//       if (err) throw err;

//       // ส่ง Token กลับไป (ผ่าน Cookie หรือ JSON แล้วแต่การใช้งาน)
//       // ตัวอย่างนี้ส่งผ่าน Cookie และ JSON
//       res.cookie("token", token).json({
//         id: userDoc._id,
//         username,
//         token: token, // ส่ง token กลับไปให้ frontend เก็บด้วยก็ได้
//       });
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// };

