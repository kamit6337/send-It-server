import User from "../../models/UserModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const getUserByUsername = catchAsyncDBError(async (username) => {
  const findUser = await User.findOne({ username })
    .select("+bg_photo +bio +location +website")
    .lean();

  return findUser;
});

export default getUserByUsername;
