import { io } from "../lib/socketConnect.js";

export const sendNewRoomIO = (obj) => {
  io.emit("newRoom", obj);
};

export const deleteRoomIO = (id) => {
  io.to(id).emit("deleteRoom", id);
};
