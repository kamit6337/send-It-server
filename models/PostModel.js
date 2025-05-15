import { Schema, model } from "mongoose";

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
    replyCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    saveCount: {
      type: Number,
      default: 0,
    },
    retweetCount: {
      type: Number,
      default: 0,
    },
    replyPostId: {
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
postSchema.index({ replyPostId: 1 });

const Post = model("Post", postSchema);

export default Post;
