import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
});

const socketConnect = () => {
  return {
    app,
    io,
    httpServer,
  };
};

export default socketConnect;
