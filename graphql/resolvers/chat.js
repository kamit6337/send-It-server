import createNewChat from "../../services/chat/createNewChat.js";
import deleteChat from "../../services/chat/deleteChat.js";
import getRoomChats from "../../services/chat/getRoomChats.js";

const chatResolvers = {
  Query: {
    getRoomChats: getRoomChats,
  },
  Mutation: {
    createNewChat: createNewChat,
    deleteChat: deleteChat,
  },
};

export default chatResolvers;
