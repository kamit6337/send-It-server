import express from "express";
import getUserMedia from "../controllers/media/getUserMedia.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getUserMedia)

export default router;
