import createNewRoom from "../../services/room/createNewRoom.js";
import deleteRoom from "../../services/room/deleteRoom.js";
import getUserRooms from "../../services/room/getUserRooms.js";

const roomResolvers = {
  Query: {
    getUserRooms: getUserRooms,
  },
  Room: {
    users: async (parent, args, { user, loaders }) => {
      return await loaders.userLoader.load(parent.users);
    },
  },
  Mutation: {
    createNewRoom: createNewRoom,
    deleteRoom: deleteRoom,
  },
};

export default roomResolvers;
