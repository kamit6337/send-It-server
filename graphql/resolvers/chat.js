import createNewChat from "../../services/chat/createNewChat.js";
import getRoomChats from "../../services/chat/getRoomChats.js";

const chatResolvers = {
  Query: {
    getRoomChats: getRoomChats,
  },
  Mutation: {
    createNewChat: createNewChat,
  },
};

export default chatResolvers;
