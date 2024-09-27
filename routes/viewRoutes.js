import express from "express";
import increaseViewCount from "../controllers/view/increaseViewCount.js";

const router = express.Router();

router.route("/").post(increaseViewCount);

export default router;
