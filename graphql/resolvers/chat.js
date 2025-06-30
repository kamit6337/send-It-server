import createNewChat from "../../services/chat/createNewChat.js";
import deleteChat from "../../services/chat/deleteChat.js";
import getRoomChats from "../../services/chat/getRoomChats.js";
import isSeenChat from "../../services/chat/isSeenChat.js";

const chatResolvers = {
  Query: {
    getRoomChats: getRoomChats,
  },
  Mutation: {
    createNewChat: createNewChat,
    deleteChat: deleteChat,
    isSeenChat: isSeenChat,
  },
};

export default chatResolvers;
