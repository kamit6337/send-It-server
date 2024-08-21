import catchAsyncError from "../../utils/catchAsyncError.js";
import preSignedAWS from "../functions/preSignedAWS.js";

const getProfilePresignedUrl = catchAsyncError(async (req, res, next) => {
  const response = await preSignedAWS(req, res, next, {
    keyFolder: "profile",
  });

  res.json({ ...response });
});

export default getProfilePresignedUrl;
