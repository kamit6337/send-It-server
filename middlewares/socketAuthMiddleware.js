import User from "../models/UserModel.js";
import { decrypt } from "../utils/encryption/encryptAndDecrypt.js";
import socketCookies from "../utils/socketCookies.js";

const err = new Error("Not Authorised");
err.status = 404;

const socketAuthMiddleware = async (socket, next) => {
  const cookie = socket.handshake.headers.cookie;

  if (!cookie) {
    return next(err);
  }

  const cookies = socketCookies(cookie);

  const { _use } = cookies;

  if (!_use) {
    return next(err);
  }

  try {
    const decoded = decrypt(_use);

    const findUser = await User.findOne({ _id: decoded.id }).lean();

    if (!findUser) {
      return next(err);
    }

    socket.user = findUser;
    socket.userId = findUser._id.toString();

    next();
  } catch (error) {
    return next(error);
  }
};

export default socketAuthMiddleware;
