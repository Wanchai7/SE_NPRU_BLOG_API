const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

// http://localhost:5000/api/v1/user/post
router.post("/post", postController.createPost);

// http://localhost:5000/api/v1/user/post
router.get("/post", postController.getPosts);

// http://localhost:5000/api/v1/user/post/1
router.get("/:id", postController.getById);

// http://localhost:5000/api/v1/user/post/author/1
router.get("/author/:id", postController.getAuthorId);

// http://localhost:5000/api/v1/user/post/1
router.put("/:authorId/:id", postController.updateById);

// http://localhost:5000/api/v1/user/post/1
router.delete("/:authorId/:id", postController.deletePost);


module.exports = router;
