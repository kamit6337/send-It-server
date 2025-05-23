import { Schema, model } from "mongoose";
import PostDetail from "./PostDetailModel.js";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      default: "",
      trim: true,
      maxLength: 200,
    },
    media: {
      type: String,
      default: "",
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    replyPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ user: 1 });
postSchema.index({ _id: 1 });
postSchema.index({ replyPost: 1 });
postSchema.index({ user: 1, replyPost: 1 });

postSchema.post("save", async function (doc, next) {
  try {
    await PostDetail.create({
      post: doc._id,
    });

    next();
  } catch (error) {
    console.error("Failed to create post detail:", err);
    next(err); // optionally pass error, or just call next() if not critical
  }
});

const Post = model("Post", postSchema);

export default Post;
