import createNewRoom from "../../services/room/createNewRoom.js";
import deleteRoom from "../../services/room/deleteRoom.js";
import getUserRooms from "../../services/room/getUserRooms.js";

const roomResolvers = {
  Query: {
    getUserRooms: getUserRooms,
  },
  Mutation: {
    createNewRoom: createNewRoom,
    deleteRoom: deleteRoom,
  },
};

export default roomResolvers;
