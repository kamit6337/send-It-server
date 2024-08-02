import * as Sentry from "@sentry/node";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import rateLimit from "express-rate-limit";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

const limiter = rateLimit({
  limit: 100, // 100 request
  windowMs: 60 * 60 * 1000, // one hour
  message: "Request goes beyound 100. try after one hour",
});

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);

app.use(limiter);

// custom-routes

// NOTE: The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
});

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
