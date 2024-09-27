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
  pingInterval: 25000, // Frequency of sending ping packets (default: 25000)
  pingTimeout: 60000, // How long to wait for a pong response before considering the connection closed (default: 60000)
});

const socketConnect = () => {
  return {
    app,
    io,
    httpServer,
  };
};

export default socketConnect;
