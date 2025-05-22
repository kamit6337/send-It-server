import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index on user and post
likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ user: 1 });
likeSchema.index({ post: 1 });

const Like = model("Like", likeSchema);

export default Like;
