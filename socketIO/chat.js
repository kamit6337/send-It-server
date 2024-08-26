import { io } from "../lib/socketConnect.js";

export const sendNewPostIO = (roomId, obj) => {
  io.to(roomId).emit("newChat", obj);
};

export const deletePostIO = (id) => {
  io.emit("deletePost", id);
};
