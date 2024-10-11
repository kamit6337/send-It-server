import newChatCreate from "../../database/Chat/newChatCreate.js";
import { sendNewPostIO } from "../../socketIO/chat.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createChat = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { roomId, message = "", media = "" } = req.body;

  if (!roomId) {
    return next(new HandleGlobalError("Please provide room id", 404));
  }

  if (!message && !media) {
    return next(
      new HandleGlobalError("Please provide message or media atleast")
    );
  }

  const obj = {
    room: roomId,
    sender: userId,
    message,
    media,
  };

  const chat = await newChatCreate(obj);

  sendNewPostIO(roomId, chat);

  res.json({
    message: "Chat created",
  });
});

export default createChat;
