import getUserRoomsDB from "../../database/Room/getUserRoomsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const getUserRooms = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const rooms = await getUserRoomsDB(findUser._id);

  // Join current user's sockets to all their chat rooms
  const userSockets = await io.in(findUser._id.toString()).fetchSockets();

  for (const room of rooms) {
    if (!room) break;

    const roomId = room._id.toString();

    userSockets.forEach((sock) => {
      sock.join(roomId);
    });
  }

  return rooms;
});

export default getUserRooms;
