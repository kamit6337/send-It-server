import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      enum: ["like", "reply", "follow"],
      required: [true, "Notification type is a must"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: "",
    },
    replyPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
