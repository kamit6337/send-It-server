import { io } from "../../app.js";
import Chat from "../../models/ChatModel.js";
import Room from "../../models/RoomModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Please provide room id", 404));
  }

  const room = Room.deleteOne({ _id: id });
  const deleteRoomChats = Chat.deleteMany({ room: id });

  await Promise.all([room, deleteRoomChats]);

  io.to(id).emit("deleteRoom", id);

  res.json({
    message: "Room and its chats are deleted",
  });
});

export default deleteRoom;
