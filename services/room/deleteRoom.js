import deleteChatsByRoomIdDB from "../../database/Chat/deleteChatsByRoomIdDB.js";
import deleteRoomDB from "../../database/Room/deleteRoomDB.js";
import getRoomByIdDB from "../../database/Room/getRoomByIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const deleteRoom = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { io } = socketConnect();

  const { roomId } = args;

  const room = await getRoomByIdDB(roomId);

  const userIds = room.users.map((id) => id.toString());

  await deleteRoomDB(roomId);

  await deleteChatsByRoomIdDB(roomId);

  userIds.forEach((userId) => {
    io.to(userId).emit("delete-room", roomId);
  });

  return "Room deleted successfully";
});

export default deleteRoom;
