import express from "express";
import createPostLike from "../controllers/like/createPostLike.js";
import removePostLike from "../controllers/like/removePostLike.js";
import getUserLikedPost from "../controllers/like/getUserLikedPost.js";

const router = express.Router();

//prettier-ignore
router.
route("/")
.post(createPostLike)
.delete(removePostLike)

//prettier-ignore
router
.route("/post")
.get(getUserLikedPost)

export default router;
