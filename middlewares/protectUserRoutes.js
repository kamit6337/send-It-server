import catchAsyncError from "../lib/catchAsyncError.js";
import Req from "../utils/Req.js";

const protectUserRoute = catchAsyncError(async (req, res, next) => {
  const findUser = await Req(req);

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectUserRoute;
