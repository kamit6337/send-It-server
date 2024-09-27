import User from "../../models/UserModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const postCreateUser = catchAsyncDBError(async (obj) => {
  const createUser = await User.create({
    ...obj,
  });

  return createUser;
});

export default postCreateUser;
