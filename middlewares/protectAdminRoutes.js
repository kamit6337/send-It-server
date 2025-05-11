import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../lib/catchAsyncError.js";
import Req from "../utils/Req.js";

const protectAdminRoutes = catchAsyncError(async (req, res, next) => {
  const findUser = await Req(req);

  if (!(findUser.role === "admin" && decodedId.role === "admin")) {
    return next(new HandleGlobalError("UnAuthorised Access", 403));
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectAdminRoutes;
