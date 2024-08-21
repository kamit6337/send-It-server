import catchAsyncError from "../../utils/catchAsyncError.js";
import preSignedAWS from "../functions/preSignedAWS.js";

const getProfileBgPresignedUrl = catchAsyncError(async (req, res, next) => {
  const response = await preSignedAWS(req, res, next, {
    keyFolder: "profile-bg",
  });

  res.json({ ...response });
});

export default getProfileBgPresignedUrl;
