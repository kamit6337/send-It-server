import Req from "../../lib/Req.js";
import createNewRoom from "../../services/room/createNewRoom.js";
import deleteRoom from "../../services/room/deleteRoom.js";
import getUserRooms from "../../services/room/getUserRooms.js";

const roomResolvers = {
  Query: {
    getUserRooms: getUserRooms,
  },
  Room: {
    users: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return await loaders.userLoader.loadMany(parent.users);
    },
    unSeenChatsCount: async (parent, args, { req, loaders }) => {
      const findUser = await Req(req);
      const roomId = parent._id;

      return await loaders.unSeenChatsCountLoader.load({
        roomId,
        userId: findUser._id,
      });
    },
  },
  Mutation: {
    createNewRoom: createNewRoom,
    deleteRoom: deleteRoom,
  },
};

export default roomResolvers;
