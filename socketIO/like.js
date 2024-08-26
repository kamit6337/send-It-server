import { io } from "../lib/socketConnect.js";

export const sendNewLikeIO = (obj) => {
  io.emit("newLike", obj);
};

export const removeLikeIO = (obj) => {
  io.emit("removeLike", obj);
};
