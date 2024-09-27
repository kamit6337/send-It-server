import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import User from "../../models/UserModel.js";

const getUserById = catchAsyncDBError(async (id) => {
  const findUser = await User.findOne({
    _id: id,
  });

  return findUser;
});

export default getUserById;
