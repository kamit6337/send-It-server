import express from "express";
import createPostReply from "../controllers/reply/createPostReply.js";
import getUserReplies from "../controllers/reply/getUserReplies.js";
import getPostReplies from "../controllers/reply/getPostReplies.js";
import getPostReply from "../controllers/reply/getPostReply.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getPostReply)
.post(createPostReply)

//prettier-ignore
router
.route("/user")
.get(getUserReplies)

//prettier-ignore
router
.route("/post")
.get(getPostReplies)

export default router;
