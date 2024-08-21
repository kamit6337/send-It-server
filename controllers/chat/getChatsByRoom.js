import Chat from "../../models/ChatModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getChatsByRoom = catchAsyncError(async (req, res, next) => {
  const { id, page = 1 } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Please provide room id", 404));
  }

  const limit = 50;
  const skip = (page - 1) * limit;

  const findChats = await Chat.find({
    room: id,
  })
    .skip(skip)
    .limit(limit);

  res.json({
    message: "Chats by Room",
    data: findChats,
  });
});

export default getChatsByRoom;
