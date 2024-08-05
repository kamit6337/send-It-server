import express from "express";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import getUserProfile from "../controllers/user/getUserProfile.js";
import getPostLike from "../controllers/user/like/getPostLike.js";
import removePostLike from "../controllers/user/like/removePostLike.js";
import createPostLike from "../controllers/user/like/createPostLike.js";
import getUserFollowing from "../controllers/user/following/getUserFollowing.js";
import createFollowing from "../controllers/user/following/createFollowing.js";
import removeFollowing from "../controllers/user/following/removeFollowing.js";
import getUserFollower from "../controllers/user/follower/getUserFollower.js";
import updateUserUsername from "../controllers/user/username/updateUserUsername.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getUserProfile)
.patch(updateUserProfile);

//prettier-ignore
router
.route("/username")
.patch(updateUserUsername);

//prettier-ignore
router.
route("/like")
.get(getPostLike)
.post(createPostLike)
.delete(removePostLike)

//prettier-ignore
router.
route("/following")
.get(getUserFollowing)
.post(createFollowing)
.delete(removeFollowing)

//prettier-ignore
router.
route("/follower")
.get(getUserFollower)

export default router;
