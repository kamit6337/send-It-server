import getUserById from "../database/User/getUserById.js";
import { decrypt } from "./encryptAndDecrypt.js";

const BEARER = "Bearer ";

const Req = async (req, isSocket = false) => {
  let userToken = null;

  if (!isSocket) {
    if (!req || !req.headers) {
      throw new Error("Something went wrong. Please try later");
    }

    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith(BEARER)) {
      throw new Error("Your do not have active session. Please Login");
    }

    userToken = authorization.split(" ")[1];
  } else {
    if (!req || !req.auth) {
      throw new Error("Something went wrong. Please try later");
    }

    const { token } = req.auth;

    if (!token || !token.startsWith(BEARER)) {
      throw new Error("Your do not have active session. Please Login");
    }

    userToken = token?.split(" ")[1];
  }

  if (!userToken) {
    throw new Error("Your do not have active session. Please Login");
  }
  const decoded = decrypt(userToken);

  const findUser = await getUserById(decoded.id);

  if (!findUser) {
    throw new Error("UnAuthorised Access. Please login again");
  }

  const currentMilli = Date.now();
  const expireTokenMin = 30 * 60 * 1000; //30 minutes
  const diffeInMilli = decoded.exp - currentMilli;

  if (diffeInMilli < expireTokenMin) {
    throw new Error("Your Session has expired. Please Login Again.");
  }

  // MARK: CHECK UPDATED-AT WHEN PASSWORD UPDATE, SO LOGIN AGAIN IF PASSWORD RESET
  const updatedAtInMilli = new Date(findUser.passwordLastUpdated).getTime();

  const BUFFER = 10000; // 10 seconds

  if (decoded.iat + BUFFER <= updatedAtInMilli) {
    //5seconds advantage
    throw new Error("Please login again...");
  }

  return findUser;
};

export default Req;
