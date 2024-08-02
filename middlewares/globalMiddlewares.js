import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import { corsOptions } from "../utils/corsOptions.js";
import session from "express-session";
import expressSessionOptions from "../utils/expressSessionOptions.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const globalMiddlewares = (app) => {
  app.use(helmet());

  app.use(cors(corsOptions));

  // Serve static files from the public folder
  //   app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static("public"));

  app.use(session(expressSessionOptions));

  // Middleware to parse incoming body
  app.use(bodyParser.json());

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to parse JSON request bodies
  app.use(express.json({ limit: "10kb" }));

  // Middleware to parse URL-encoded request bodies (optional)
  app.use(express.urlencoded({ extended: true }));

  //prevent attack from NoSQL query
  app.use(mongoSanitize());

  // prvent XSS attack
  app.use(xss());

  return app;
};

export default globalMiddlewares;
