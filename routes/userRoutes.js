import express from "express";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import getUserProfile from "../controllers/user/getUserProfile.js";
import getUserPost from "../controllers/user/getUserPost.js";
import updateUserUsername from "../controllers/user/updateUserUsername.js";

const router = express.Router();

//prettier-ignore
router
.route("/post")
.get(getUserPost)

//prettier-ignore
router
.route("/")
.get(getUserProfile)
.patch(updateUserProfile);

//prettier-ignore
router
.route("/username")
.patch(updateUserUsername);

export default router;
