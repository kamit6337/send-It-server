import express from "express";
import getChatsByRoom from "../controllers/chat/getChatsByRoom.js";
import createChat from "../controllers/chat/createChat.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getChatsByRoom)
.post(createChat)

export default router;
