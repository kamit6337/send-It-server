import User from "../../models/UserModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const checkUserExistWithSameUsername = catchAsyncDBError(
  async (userId, username) => {
    const findUser = await User.exists({
      _id: { $ne: userId },
      username,
    });

    return !!findUser;
  }
);

export default checkUserExistWithSameUsername;
