import express from "express";
import createPost from "../controllers/post/createPost.js";
import getSinglePost from "../controllers/post/getSinglePost.js";
import deletePost from "../controllers/post/deletePost.js";
import updatePost from "../controllers/post/updatePost.js";
import getPostDetails from "../controllers/post/getPostDetails.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getSinglePost)
.post(createPost)
.patch(updatePost)
.delete(deletePost)

//prettier-ignore
router
.route("/details")
.get(getPostDetails)

export default router;
