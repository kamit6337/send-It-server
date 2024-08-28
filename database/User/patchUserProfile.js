import User from "../../models/UserModel.js";
import { setUserWithIdToCache } from "../../redis/User/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const patchUserProfile = catchAsyncDBError(async (userId, obj) => {
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      ...obj,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await setUserWithIdToCache(user);

  return user;
});

export default patchUserProfile;
