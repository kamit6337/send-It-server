import express from "express";
import createNewSave from "../controllers/save/createNewSave.js";
import removeSavedPost from "../controllers/save/removeSavedPost.js";
import getUserSavedPost from "../controllers/save/getUserSavedPost.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.post(createNewSave)
.delete(removeSavedPost)

//prettier-ignore
router
.route("/post")
.get(getUserSavedPost)

export default router;
