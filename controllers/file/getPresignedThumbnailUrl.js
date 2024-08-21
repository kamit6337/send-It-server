import catchAsyncError from "../../utils/catchAsyncError.js";
import preSignedAWS from "../functions/preSignedAWS.js";

const getPresignedThumbnailUrl = catchAsyncError(async (req, res, next) => {
  const response = await preSignedAWS(req, res, next, {
    keyFolder: "thumbnails",
  });

  res.json({ ...response });
});

export default getPresignedThumbnailUrl;
