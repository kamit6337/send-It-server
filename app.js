import * as Sentry from "@sentry/node";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import replyRouter from "./routes/replyRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import followerRouter from "./routes/followerRoutes.js";
import followingRouter from "./routes/followingRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import mediaRouter from "./routes/mediaRoutes.js";
import saveRouter from "./routes/saveRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import protectRoute from "./middlewares/protectRoute.js";
import socketAuthMiddleware from "./middlewares/socketAuthMiddleware.js";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
});

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// NOTE: SOCKET CONNECTION
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("isConnected", (arg, callback) => {
    console.log(arg);

    callback("Yeah, is connected");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/file", protectRoute, fileRouter);
app.use("/user", protectRoute, userRouter);
app.use("/post", protectRoute, postRouter);
app.use("/reply", protectRoute, replyRouter);
app.use("/save", protectRoute, saveRouter);
app.use("/follower", protectRoute, followerRouter);
app.use("/following", protectRoute, followingRouter);
app.use("/like", protectRoute, likeRouter);
app.use("/media", protectRoute, mediaRouter);
app.use("/search", protectRoute, searchRouter);

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

export default httpServer;
