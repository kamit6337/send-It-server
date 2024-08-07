import express from "express";
import getPresignedUrl from "../controllers/file/getPresignedUrl.js";
const router = express.Router();

router.post("/", getPresignedUrl);

export default router;
