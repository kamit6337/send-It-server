import express from "express";
import getUserFollowingPost from "../controllers/following/getUserFollowingPost.js";
import createFollowing from "../controllers/following/createFollowing.js";
import getUserFollowingCheck from "../controllers/following/getUserFollowingCheck.js";
import getUserFollowing from "../controllers/following/getUserFollowing.js";
import removeFollowing from "../controllers/following/removeFollowing.js";

const router = express.Router();

//prettier-ignore
router
.route("/post")
.get(getUserFollowingPost)

//prettier-ignore
router.
route("/")
.get(getUserFollowing)
.post(createFollowing)
.delete(removeFollowing)

//prettier-ignore
router.
route("/check")
.get(getUserFollowingCheck)

export default router;
