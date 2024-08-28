import User from "../../models/UserModel.js";
import {
  setUserWithIdToCache,
  setUserWithUsernameToCache,
} from "../../redis/User/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const postCreateUser = catchAsyncDBError(
  async ({
    name,
    username,
    email,
    photo,
    password,
    OAuthId,
    OAuthProvider,
  }) => {
    if (!name || !email || !username || !photo) {
      throw new Error("All fields must be provided");
    }

    const obj = {
      name,
      username,
      email,
      photo,
    };

    if (password) obj.password = password;
    if (OAuthId) obj.OAuthId = OAuthId;
    if (OAuthProvider) obj.OAuthProvider = OAuthProvider;

    const createUser = await User.create({
      ...obj,
    });

    if (createUser) {
      const promises = [
        setUserWithIdToCache(createUser),
        setUserWithUsernameToCache(createUser),
      ];

      await Promise.all(promises);
    }

    return createUser;
  }
);

export default postCreateUser;
