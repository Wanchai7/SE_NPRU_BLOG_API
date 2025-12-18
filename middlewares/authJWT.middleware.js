const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      message: "Token is missing",
    });
  }
  jwt.verify(token, secret, (error, decoded) => {
    if (error)
      return res.status(403).send({
        message: "Access Forbidden",
      });
    // ถ้ามีก็สามารถเข้าได้
    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  });
};

const authjwt = {
  verifyToken,
};
module.exports = authjwt;
