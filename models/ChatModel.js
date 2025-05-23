import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isSeen: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    message: {
      type: String,
      trim: true,
      default: "",
    },
    media: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

export default Chat;
