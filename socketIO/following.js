import { io } from "../lib/socketConnect.js";

export const sendNewFollowingIO = (obj) => {
  io.emit("newFollowing", obj);
};

export const deleteFollowingIO = (obj) => {
  io.emit("removeFollowing", obj);
};
