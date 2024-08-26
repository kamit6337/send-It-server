import { io } from "../lib/socketConnect.js";

export const sendNewSaveIO = (obj) => {
  io.emit("newSave", obj);
};

export const removeSaveIO = (obj) => {
  io.emit("removeSave", obj);
};
