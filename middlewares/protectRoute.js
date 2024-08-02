import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import User from "../models/UserModel.js";
import Req from "../utils/Req.js";
import { decrypt } from "../utils/encryption/encryptAndDecrypt.js";

const protectRoute = catchAsyncError(async (req, res, next) => {
  const { _use } = Req(req);

  if (!_use) {
    return next(new HandleGlobalError("UnAuthorized Access", 403, "Failed"));
  }

  const decoded = decrypt(_use);

  const findUser = await User.findById(decoded.id).lean();

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
