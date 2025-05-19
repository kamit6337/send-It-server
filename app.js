import "./lib/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routes/authRoutes.js";
import globalMiddlewares from "./middlewares/globalMiddlwares.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import cors from "cors";
import unIdentifiedUrlError from "./middlewares/unIdentifiedUrlError.js";
import socketAuthMiddleware from "./middlewares/socketAuthMiddleware.js";
import socketConnect from "./lib/socketConnect.js";
import newConnection from "./sockets/newConnection.js";
import joinRooms from "./sockets/joinRooms.js";
import onDisconnect from "./sockets/onDisconnect.js";
import "./queues/notificationQueues/followQueue.js";

const { app, httpServer, io } = socketConnect();

const init = async () => {
  try {
    app.get("/", (req, res) => {
      res.send("Hello from the server");
    });

    app.get("/health", (req, res) => {
      res.send("Server health is fine and good");
    });

    // MARK: SOCKET CONNECTION
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      const userId = socket.userId;
      socket.join(userId);

      newConnection(socket);
      joinRooms(socket);
      onDisconnect(socket);
    });

    // MARK: GLOBAL MIDDLEWARES
    globalMiddlewares(app);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (formattedError, error) => {
        console.log("formatted Error", formattedError);
        console.log("error", error.message);

        return error?.message;
      },
    });

    await server.start();

    app.use(
      "/graphql",
      cors(),
      expressMiddleware(server, {
        context: ({ req }) => {
          return { req };
        },
      })
    );

    // NOTE: DIFFERENT ROUTES
    app.use("/auth", authRouter);

    // NOTE: UNIDENTIFIED ROUTES
    app.all("*", unIdentifiedUrlError);

    //  NOTE: GLOBAL ERROR HANDLER
    app.use(globalErrorHandler);
  } catch (error) {
    console.log("Issue in server started", error);
  }
};

init();

export { app };

export default httpServer;
