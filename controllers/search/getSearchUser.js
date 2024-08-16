import User from "../../models/UserModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getSearchUser = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { search } = req.query;

  if (!search) {
    return next(new HandleGlobalError("Please provide search text", 404));
  }

  const users = await User.find({
    $or: [
      { name: { $regex: new RegExp(search, "i") } },
      { username: { $regex: new RegExp(search, "i") } },
    ],
    _id: { $ne: userId },
  });

  res.json({
    message: "Searched user",
    data: users,
  });
});

export default getSearchUser;
