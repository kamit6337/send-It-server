import createNewRoom from "../../services/room/createNewRoom.js";
import deleteRoom from "../../services/room/deleteRoom.js";
import getUserRooms from "../../services/room/getUserRooms.js";

const roomResolvers = {
  Query: {
    getUserRooms: getUserRooms,
  },
  Room: {
    users: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      return await loaders.userLoader.loadMany(parent.users);
    },
    unSeenChatsCount: async (
      parent,
      args,
      { req, user, authError, loaders }
    ) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      const roomId = parent._id;

      return await loaders.unSeenChatsCountLoader.load({
        roomId,
        userId: user._id,
      });
    },
  },
  Mutation: {
    createNewRoom: createNewRoom,
    deleteRoom: deleteRoom,
  },
};

export default roomResolvers;
