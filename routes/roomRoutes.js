import express from "express";
import getUserRooms from "../controllers/room/getUserRooms.js";
import createNewRoom from "../controllers/room/createNewRoom.js";
import deleteRoom from "../controllers/room/deleteRoom.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getUserRooms)
.post(createNewRoom)
.delete(deleteRoom)

export default router;
