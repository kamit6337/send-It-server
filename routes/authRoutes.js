import { environment } from "../utils/environment.js";
import express from "express";
import passport from "passport";
import OAuthLogin from "../controllers/auth/OAuth-login/OAuthLogin.js";

const router = express.Router();

// NOTE: OAUTH SIGNUP AND LOGIN
router.get("/login/OAuth", OAuthLogin);

// NOTE: GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/OAuth",
    failureRedirect: environment.CLIENT_URL,
  })
);

export default router;
