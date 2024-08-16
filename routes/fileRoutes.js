import express from "express";
import getPresignedUrl from "../controllers/file/getPresignedUrl.js";
import getPresignedThumbnailUrl from "../controllers/file/getPresignedThumbnailUrl.js";
const router = express.Router();

router.post("/", getPresignedUrl);
router.post("/thumbnail", getPresignedThumbnailUrl);

export default router;
