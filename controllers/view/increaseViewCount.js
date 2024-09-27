import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import viewCountFunction from "../functions/viewCountFunction.js";

const increaseViewCount = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  await viewCountFunction(id);

  res.json({
    message: "Increase view count",
  });
});

export default increaseViewCount;
