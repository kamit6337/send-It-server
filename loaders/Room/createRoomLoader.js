import DataLoader from "dataloader";
import Room from "../../models/RoomModel.js";

const createRoomLoader = () =>
  new DataLoader(async (ids) => {
    const rooms = await Room.find({
      _id: { $in: ids },
    }).lean();

    const map = new Map(rooms.map((room) => [room._id?.toString(), room]));

    return ids.map((id) => map.get(id?.toString()));
  });

export default createRoomLoader;
