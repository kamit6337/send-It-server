import express from "express";
import createPost from "../controllers/post/createPost.js";
import getSinglePost from "../controllers/post/getSinglePost.js";
import deletePost from "../controllers/post/deletePost.js";
import getUserPost from "../controllers/post/user/getUserPost.js";
import getUserLikedPost from "../controllers/post/like/getUserLikedPost.js";
import updatePost from "../controllers/post/updatePost.js";
import getUserFollowingPost from "../controllers/post/following/getUserFollowingPost.js";

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
.route("/following")
.get(getUserFollowingPost)

//prettier-ignore
router
.route("/user")
.get(getUserPost)

//prettier-ignore
router
.route("/like")
.get(getUserLikedPost)

export default router;
