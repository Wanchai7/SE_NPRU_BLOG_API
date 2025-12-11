const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true }, 
  summary: { type: String, required: true },
  cover: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId, 
    ref: "User",  // อ้างอิงมาจาก ref User
    required: true,},
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }, 
},{
    timestamps:true,
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
