import User from "../../models/UserModel.js";
import {
  getCacheUserFromUsername,
  setUserWithUsernameToCache,
} from "../../redis/User/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const getUserByUsername = catchAsyncDBError(async (username) => {
  const user = await getCacheUserFromUsername(username);

  if (user) return user;

  const findUser = await User.findOne({ username })
    .select("+bg_photo +bio +location +website")
    .lean();

  if (findUser) {
    await setUserWithUsernameToCache(findUser);
  }

  return findUser;
});

export default getUserByUsername;
