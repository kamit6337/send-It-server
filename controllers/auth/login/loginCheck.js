import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import Req from "../../../utils/Req.js";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import getUserById from "../../../database/User/getUserById.js";

const loginCheck = catchAsyncError(async (req, res, next) => {
  const { _use } = Req(req);

  if (!_use) {
    return next(
      new HandleGlobalError(
        "Your do not have active session. Please Login",
        403
      )
    );
  }

  const decoded = decrypt(_use);

  const findUser = await getUserById(decoded.id);

  if (!findUser) {
    return next(
      new HandleGlobalError("Unauthorised Access. Please Login Again.", 400)
    );
  }

  const currentMilli = Date.now();
  const expireTokenMin = 30 * 60 * 1000; //30 minutes
  const diffeInMilli = decoded.exp - currentMilli;

  if (diffeInMilli < expireTokenMin) {
    return next(
      new HandleGlobalError(
        "Your Session has expired. Please Login Again.",
        400
      )
    );
  }

  // MARK: CHECK UPDATED-AT WHEN PASSWORD UPDATE, SO LOGIN AGAIN IF PASSWORD RESET
  const updatedAtInMilli = new Date(findUser.updatedAt).getTime();

  if (decoded.iat + 5000 <= updatedAtInMilli) {
    //5seconds advantage
    return next(new HandleGlobalError("Please login again...", 403));
  }

  res.json({
    message: "User is present",
    _id: findUser._id,
    name: findUser.name,
    username: findUser.username,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  });
});

export default loginCheck;
