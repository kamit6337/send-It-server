// import {
//   getCacheUserFromId,
//   setUserWithIdToCache,
// } from "../../redis/User/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import User from "../../models/UserModel.js";

const getUserById = catchAsyncDBError(async (id) => {
  // const user = await getCacheUserFromId(id);
  // if (user) return user;

  const findUser = await User.findOne({
    _id: id,
  });

  // if (findUser) {
  //   await setUserWithIdToCache(findUser);
  // }

  return findUser;
});

export default getUserById;
