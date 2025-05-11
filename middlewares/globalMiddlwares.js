import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { corsOptions } from "../lib/corsOptions.js";
import session from "express-session";
import expressSessionOptions from "../lib/expressSessionOptions.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";

const globalMiddlewares = (app) => {
  app.use(helmet());

  app.use(cors(corsOptions));

  app.use(session(expressSessionOptions));

  // Middleware to parse incoming body
  app.use(bodyParser.json());

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Middleware to parse URL-encoded request bodies (optional)
  app.use(express.urlencoded({ extended: true }));

  //prevent attack from NoSQL query
  app.use(mongoSanitize());

  return app;
};

export default globalMiddlewares;
