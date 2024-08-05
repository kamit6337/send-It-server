import express from "express";
import createPostReply from "../controllers/reply/createPostReply.js";
import getUserReplies from "../controllers/reply/user/getUserReplies.js";
import getPostReplies from "../controllers/reply/post/getPostReplies.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
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
