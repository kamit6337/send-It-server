import { Schema, model } from "mongoose";

const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    replyPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

replySchema.index({ user: 1 });
replySchema.index({ post: 1 });

const Reply = model("Reply", replySchema);

export default Reply;
