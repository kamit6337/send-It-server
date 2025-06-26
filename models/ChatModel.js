import { Schema, model } from "mongoose";

const chatSchema = new Schema({
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
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Chat = model("Chat", chatSchema);

export default Chat;
