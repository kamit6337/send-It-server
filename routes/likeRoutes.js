import express from "express";
import getPostLike from "../controllers/like/getPostLike.js";
import createPostLike from "../controllers/like/createPostLike.js";
import removePostLike from "../controllers/like/removePostLike.js";
import getUserLikedPost from "../controllers/like/getUserLikedPost.js";

const router = express.Router();

//prettier-ignore
router.
route("/")
.get(getPostLike)
.post(createPostLike)
.delete(removePostLike)

//prettier-ignore
router
.route("/post")
.get(getUserLikedPost)

export default router;
