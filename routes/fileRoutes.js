import express from "express";
import getPresignedUrl from "../controllers/file/getPresignedUrl.js";
import getPresignedThumbnailUrl from "../controllers/file/getPresignedThumbnailUrl.js";
import getProfilePresignedUrl from "../controllers/file/getProfilePresignedUrl.js";
import getProfileBgPresignedUrl from "../controllers/file/getProfileBgPresignedUrl.js";

const router = express.Router();

router.post("/", getPresignedUrl);
router.post("/thumbnail", getPresignedThumbnailUrl);
router.post("/profile", getProfilePresignedUrl);
router.post("/profile_bg", getProfileBgPresignedUrl);

export default router;
