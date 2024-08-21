import catchAsyncError from "../../utils/catchAsyncError.js";
import preSignedAWS from "../functions/preSignedAWS.js";

const getChatPresignedUrl = catchAsyncError(async (req, res, next) => {
  const response = await preSignedAWS(req, res, next, { keyFolder: "chats" });

  res.json({ ...response });
});

export default getChatPresignedUrl;
