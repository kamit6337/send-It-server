import User from "../../models/UserModel.js";
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

  return user;
});

export default patchUserProfile;
