import getUserRoomsDB from "../database/Room/getUserRoomsDB.js";

const joinRooms = (socket) => {
  socket.on("joinRooms", async () => {
    const userId = socket.userId;

    const rooms = await getUserRoomsDB(userId);

    if (rooms.length === 0) return;

    rooms.forEach((room) => {
      socket.join(room._id.toString());
    });
  });
};

export default joinRooms;
