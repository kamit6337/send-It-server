import createChat from "../../../controllers/chat/createChat.js";
import newChatCreate from "../../../database/Chat/newChatCreate.js";
import { sendNewPostIO } from "../../../socketIO/chat.js";

jest.mock("../../../database/Chat/newChatCreate.js");
jest.mock("../../../socketIO/chat.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "userId",
    body: {
      roomId: "roomId",
      message: "message",
      media: "media",
    },
  };

  res = {
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: CREATE CHAT SUCCESSFULLY
it("create chat successfully", async () => {
  const userId = req.userId;
  const { roomId, message, media } = req.body;

  const obj = {
    room: roomId,
    sender: userId,
    message,
    media,
  };

  const mockValue = {
    _id: "ChatId",
    room: roomId,
    sender: userId,
    message,
    media,
  };

  newChatCreate.mockResolvedValue(mockValue);

  await createChat(req, res, next);

  expect(sendNewPostIO).toHaveBeenCalledWith("roomId", mockValue);

  expect(newChatCreate).toHaveBeenCalledWith(obj);

  expect(res.json).toHaveBeenCalledWith({
    message: "Chat created",
  });
});

// NOTE: FAILED, ROOMID NOT PRESENT
it("failed, roomId not present", async () => {
  req.body = {};

  await createChat(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please provide room id",
    })
  );
});

// NOTE: FAILED, MESSAGE AND MEDIA IS NOT PRESENT
it("failed, message and media is not present", async () => {
  req.body = {
    roomId: "roomId",
  };

  await createChat(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please provide message or media atleast",
    })
  );
});
