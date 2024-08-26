import Room from "../../models/RoomModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { sendNewRoomIO } from "../../socketIO/room.js";

const createNewRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Member Id is not provided", 404));
  }

  const roomAlreadyPresent = await Room.findOne({
    users: [userId, id],
  });

  if (roomAlreadyPresent) {
    return next(
      new HandleGlobalError("Chat is already present with that user", 404)
    );
  }

  const newRoom = await Room.create({
    users: [userId, id],
  });

  const findRoom = await Room.findOne({
    _id: newRoom._id.toString(),
  }).populate({
    path: "users",
    select: "_id name username photo",
  });

  sendNewRoomIO(findRoom);

  res.json({
    message: "New Romm is created",
  });
});

export default createNewRoom;
