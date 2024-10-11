import getChatsByRoom from "../../../controllers/chat/getChatsByRoom.js";
import chatsByRoomId from "../../../database/Chat/chatsByRoomId.js";

jest.mock("../../../database/Chat/chatsByRoomId.js");

let req, res, next;

beforeEach(() => {
  req = {
    query: {
      id: "roomId",
      page: 1,
    },
  };

  res = {
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: GET CHAT BY ROOM FOR PAGE = 1 SUCCESSFULLY
it("get chat be room for page = 1 successfully", async () => {
  const { id, page } = req.query;

  const mockChats = [
    {
      _id: "chatId",
      room: "roomId",
      message: "message",
    },
  ];

  chatsByRoomId.mockReturnValue(mockChats);

  await getChatsByRoom(req, res, next);

  expect(chatsByRoomId).toHaveBeenCalledWith(id, page);
  expect(res.json).toHaveBeenCalledWith(mockChats);
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
