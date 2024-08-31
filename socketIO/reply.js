import { io } from "../lib/socketConnect.js";

export const sendNewReplyIO = (obj) => {
  io.emit("newReply", obj);
};

export const sendUpdatedReplyIO = (obj) => {
  io.emit("updateReply", obj);
};

export const removeReplyIO = (obj) => {
  io.emit("removeReply", obj);
};
