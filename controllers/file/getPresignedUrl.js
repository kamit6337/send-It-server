import catchAsyncError from "../../utils/catchAsyncError.js";
import preSignedAWS from "../functions/preSignedAWS.js";

const getPresignedUrl = catchAsyncError(async (req, res, next) => {
  const response = await preSignedAWS(req, res, next, {
    keyFolder: "posts",
  });

  res.json({ ...response });
});

export default getPresignedUrl;
