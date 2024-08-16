import express from "express";
import getUserFollower from "../controllers/follower/getUserFollower.js";

const router = express.Router();

//prettier-ignore
router.
route("/")
.get(getUserFollower)

export default router;
