import checkUserExistWithSameUsername from "../../database/User/checkUserExistWithSameUsername.js";
import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateUserUsername = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { username } = req.body;

  if (!username) {
    return next(new HandleGlobalError("Username must be provided", 404));
  }

  const findUser = await checkUserExistWithSameUsername(userId, username);

  if (findUser) {
    return next(
      new HandleGlobalError("Username is already present. Try different.", 404)
    );
  }

  const obj = {
    username,
  };

  const user = await patchUserProfile(userId, obj);

  res.json({
    message: "Updated",
    data: user,
  });
});

export default updateUserUsername;
