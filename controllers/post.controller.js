const PostModel = require("../models/post.model");

exports.createPost = async (req, res) => {
  //ทั้งหมดนี้อยู่ใน body require
  const { title, summary, content, cover } = req.body;
  const authorId = req.authorId;
  //เช็คว่าสงข้อมูลว่าครบมั้ย title, summary, content, cover, author
  if (!title || !summary || !content || !cover) {
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
      author: authorId,
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

exports.updateById = async (req, res) => {
  try {
    //เช็คว่าไอดี Post กับ Author ตรงกันมั้ย
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id and authorId are required!" });
    }
    //ส่งข้อมูลมามั้ยครบมั้ยในการอัพเดพ
    const { title, summary, content, cover } = req.body;
    // ถ้า “ไม่มีค่าเลยสัก field เดียว” → ให้ error
    if (!title || !summary || !content || !cover) {
      return res.status(400).json({ message: "at all field is required" });
    }
    const authorId = req.authorId;
    const updated = await PostModel.findOneAndUpdate(
      { _id: id, author: authorId },
      { title, summary, content, cover },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post Updated Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at update by id", error: error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.authorId;
    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }

    const deleted = await PostModel.findOneAndDelete({
      _id: id,
      author: authorId,
    });
    if (!deleted) {
      return res.status(500).json({ message: "Can't Delete The Post" });
    }

    res.json({ message: "Post Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error at delete by id" });
  }
};
