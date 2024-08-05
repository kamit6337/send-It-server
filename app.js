import * as Sentry from "@sentry/node";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import replyRouter from "./routes/replyRoutes.js";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import protectRoute from "./middlewares/protectRoute.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);
app.use("/post", protectRoute, postRouter);
app.use("/reply", protectRoute, replyRouter);

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
