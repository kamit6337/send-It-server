import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import Req from "../utils/Req.js";
import { decrypt } from "../utils/encryption/encryptAndDecrypt.js";
import getUserById from "../database/User/getUserById.js";

const protectRoute = catchAsyncError(async (req, res, next) => {
  const { _use } = Req(req);

  if (!_use) {
    return next(new HandleGlobalError("Please Login Again...", 403, "Failed"));
  }

  const decoded = decrypt(_use);

  const findUser = await getUserById(decoded.id);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "UnAuthorized Access. You are not our User",
        403,
        "Failed"
      )
    );
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectRoute;
