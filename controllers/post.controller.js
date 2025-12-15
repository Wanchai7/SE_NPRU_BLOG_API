const PostModel = require("../models/post.model");

exports.createPost = async (req, res) => {
  //ทั้งหมดนี้อยู่ใน body require
  const { title, summary, content, cover, author } = req.body;
  //เช็คว่าสงข้อมูลว่าครบมั้ย title, summary, content, cover, author
  if (!title || !summary || !content || !cover || !author) {
    //
    return res.status(400).send({
      // คืนข้อความไปว่าให้กรอกทุกช่องถ้าหากกรอกข้อมูลไม่ครบ
      message: "please provide all fields",
    });
  }
  //เป็นสร้างข้อมูล post โดยอยู่ในตัวแปร postDoc
  try {
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover,
      author,
    });
    //เช็ค postDoc
    if (!postDoc) {
      return res.status(500).send({
        message: "Cannot create a new post",
      });
    }
    //ส่งข้อมูลกลับไป
    res.send({ message: "Create a new post successfully", data: postDoc });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while logging in user",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(10);
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors Get All post",
    });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({
      message: "Id is missing",
    });
  }
  try {
    const post = await PostModel.findById(id)
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(10);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors Get All post",
    });
  }
};

exports.getAuthorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({
      message: "Author Id is missing",
    });
  }
  try {
    const post = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(10);
    if (!post) {
      return res.status(404).send({ message: "Author not found" });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors Author",
    });
  }
};
