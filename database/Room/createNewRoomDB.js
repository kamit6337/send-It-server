import Room from "../../models/RoomModel.js";

const createNewRoomDB = async (userIds) => {
  if (!Array.isArray(userIds) || userIds.length !== 2) {
    throw new Error("UserIds must be an array of exactly two users");
  }

  // Normalize and sort the user IDs to ensure consistent ordering
  const sortedIds = userIds.map((id) => id.toString()).sort();

  console.log("sortedIds", sortedIds);

  // Check for existing room with exactly the same two users
  const existingRoom = await Room.findOne({
    users: { $all: sortedIds, $size: 2 },
  });

  console.log("existingRoom", existingRoom);

  if (existingRoom) {
    throw new Error("Room with the same users already exists");
  }

  // Create and save new room
  const room = new Room({ users: sortedIds });
  await room.save();

  // Populate users on the saved document
  await room.populate({
    path: "users",
    select: "_id name email photo",
  });

  return room.toObject();
};

export default createNewRoomDB;
