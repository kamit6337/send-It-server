import Req from "../lib/Req.js";

const socketAuthMiddleware = async (socket, next) => {
  try {
    const findUser = await Req(socket.handshake, true);

    socket.user = findUser;
    socket.userId = findUser._id.toString();

    next();
  } catch (error) {
    return next(error);
  }
};

export default socketAuthMiddleware;
