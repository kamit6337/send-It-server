const joinRooms = (socket) => {
  socket.on("joinRooms", (roomIds) => {
    if (!roomIds || roomIds.length === 0) return;
    roomIds.map((roomId) => {
      socket.join(roomId);
      console.log("room joined", roomId);
    });
  });
};

export default joinRooms;
