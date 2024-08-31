import { io } from "../lib/socketConnect.js";

export const sendNewPostIO = (obj) => {
  io.emit("newPost", obj);
};

export const updatePostIO = (obj) => {
  io.emit("updatePost", obj);
};

export const deletePostIO = (id) => {
  io.emit("deletePost", id);
};
