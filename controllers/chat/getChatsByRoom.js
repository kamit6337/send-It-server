import chatsByRoomId from "../../database/Chat/chatsByRoomId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getChatsByRoom = catchAsyncError(async (req, res, next) => {
  const { id, page = 1 } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Please provide room id", 404));
  }

  const findChats = await chatsByRoomId(id, page);

  res.json(findChats);
});

export default getChatsByRoom;
