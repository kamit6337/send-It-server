import { Schema, model } from "mongoose";

const postDetailSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
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
  },
  { timestamps: true }
);

postDetailSchema.index({ post: 1 }, { unique: true });

const PostDetail = model("PostDetail", postDetailSchema);

export default PostDetail;
