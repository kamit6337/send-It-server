import User from "../../../models/UserModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const updateUserUsername = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { username } = req.body;

  if (!username) {
    return next(new HandleGlobalError("Username must be provided", 404));
  }

  const findUser = await User.findOne({
    _id: { $ne: userId },
    username,
  });

  if (findUser) {
    return next(
      new HandleGlobalError("Username is already present. Try different.", 404)
    );
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      username,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    message: "Updated",
    data: user,
  });
});

export default updateUserUsername;
