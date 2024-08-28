import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, bio, photo, bg_photo, location, website } = req.body;

  if (!name || !photo) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const obj = {
    name,
    photo,
  };

  if (bio) obj.bio = bio;
  if (bg_photo) obj.bg_photo = bg_photo;
  if (location) obj.location = location;
  if (website) obj.website = website;

  const user = await patchUserProfile(userId, obj);

  res.json({
    message: "Updated",
    data: user,
  });
});

export default updateUserProfile;
