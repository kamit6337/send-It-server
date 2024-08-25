import getChatsByRoom from "../../../controllers/chat/getChatsByRoom.js";
import Chat from "../../../models/ChatModel.js";

jest.mock("../../../models/ChatModel.js");

let req, res, next;

beforeEach(() => {
  req = {
    query: {
      id: "roomId",
      page: 1,
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: GET CHAT BY ROOM FOR PAGE = 1 SUCCESSFULLY
it("get chat be room for page = 1 successfully", async () => {
  const mockChats = [
    {
      _id: "chatId",
      room: "roomId",
      message: "message",
    },
  ];

  const skip = jest.fn().mockReturnThis();
  const limit = jest.fn().mockResolvedValue(mockChats);

  Chat.find.mockReturnValue({
    skip,
    limit,
  });

  await getChatsByRoom(req, res, next);

  expect(Chat.find).toHaveBeenCalledWith({ room: "roomId" });
  expect(skip).toHaveBeenCalledWith(0);
  expect(limit).toHaveBeenCalledWith(50);

  expect(res.json).toHaveBeenCalledWith({
    message: "Chats by Room",
    data: mockChats,
  });
});

// NOTE: GET CHAT BY ROOM FOR PAGE = 2 SUCCESSFULLY
it("get chat be room for page = 2 successfully", async () => {
  req.query.page = 2;

  const mockChats = [
    {
      _id: "chatId",
      room: "roomId",
      message: "message",
    },
  ];

  const skip = jest.fn().mockReturnThis();
  const limit = jest.fn().mockResolvedValue(mockChats);

  Chat.find.mockReturnValue({
    skip,
    limit,
  });

  await getChatsByRoom(req, res, next);

  expect(Chat.find).toHaveBeenCalledWith({ room: "roomId" });
  expect(skip).toHaveBeenCalledWith(50);
  expect(limit).toHaveBeenCalledWith(50);

  expect(res.json).toHaveBeenCalledWith({
    message: "Chats by Room",
    data: mockChats,
  });
});

// NOTE: FAILED, DUE TO EMPTY REQ.QUERY
it("failed, due to empty req.query", async () => {
  req.query = {};

  await getChatsByRoom(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please provide room id",
    })
  );
});
