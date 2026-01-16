const PostModel = require("../models/Post");

exports.createPost = async (req, res) => {
  // console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { title, summary, content } = req.body;
  const authorId = req.authorId;
  if (!title || !summary || !content) {
    return res.status(400).send({
      message: "Please provide all fields",
    });
  }
  try {
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: req.file.firebaseUrl,
      author: authorId,
    });
    if (!postDoc) {
      return res.status(500).send({
        message: "Cannot create a new post",
      });
    }
    res.send({ message: "Create a new post successfully", data: postDoc });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  try {
    const post = await PostModel.findById(id).populate("author", ["username"]);
    // .sort({ createdAt: -1 })
    // .limit(20);
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.getByAuthorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Author id is missing",
    });
  }
  try {
    const posts = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.upDatePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  const { title, summary, content, cover } = req.body;
  if (!title || !summary || !content || !cover) {
    return res.status(400).send({
      message: "Please provide all fields",
    });
  }
  try {
    const postDoc = await PostModel.findOne({ _id: id, author: authorId });

    if (!postDoc) {
      return res.status(404).send({ message: "Post not found" });
    }
    if (postDoc.length === 0) {
      return res.status(403).send({
        message:
          "Unauthorize to edit this post, because you are not the author of this post",
      });
    } else {
      // postDoc.title = title;
      // postDoc.summary = summary;
      // postDoc.content = content;
      // postDoc.cover = cover;
      // await postDoc.save();
      const newPost = await PostModel.findOneAndUpdate(
        { author: authorId, _id: id },
        { title, summary, content, cover },
        {
          new: true,
        }
      );
      if (!newPost) {
        return res.status(500).send({ message: "Cannot update this post" });
      }
      res.send({ message: "Post updated successfully" });
    }
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;

  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  try {
    const postDoc = await PostModel.findOneAndDelete({
      author: authorId,
      _id: id,
    });
    if (!postDoc) {
      return res.status(500).send({ message: "Cannot delete this post" });
    }
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || "Some errors occurred while registering a new user",
    });
  }
};
