import deleteChatsByRoomIdDB from "../../database/Chat/deleteChatsByRoomIdDB.js";
import deleteRoomDB from "../../database/Room/deleteRoomDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { deleteRoomFromRedis } from "../../redis/Chat/chat.js";

const deleteRoom = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { io } = socketConnect();

  const { roomId } = args;

  await deleteRoomDB(roomId);

  await deleteChatsByRoomIdDB(roomId);

  await deleteRoomFromRedis(roomId);

  io.to(roomId).emit("delete-room", roomId);

  return "Room deleted successfully";
});

export default deleteRoom;
