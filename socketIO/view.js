import { io } from "../lib/socketConnect.js";

export const sendNewViewIO = (obj) => {
  io.emit("newView", obj);
};
