import { io } from "../lib/socketConnect.js";

export const sendNewPostIO = (obj) => {
  io.emit("newPost", obj);
};

export const deletePostIO = (id) => {
  io.emit("deletePost", id);
};
