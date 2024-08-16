import express from "express";
import getSearchUser from "../controllers/search/getSearchUser.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.get(getSearchUser)

export default router;
