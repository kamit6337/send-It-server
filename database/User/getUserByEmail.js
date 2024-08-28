import User from "../../models/UserModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const getUserByEmail = catchAsyncDBError(async (email) => {
  const findUser = await User.findOne({ email }).select("+password");
  return findUser;
});

export default getUserByEmail;
