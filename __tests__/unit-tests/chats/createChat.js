import createChat from "../../../controllers/chat/createChat.js";
import Chat from "../../../models/ChatModel.js";
import { sendNewPostIO } from "../../../socketIO/chat.js";

jest.mock("../../../models/ChatModel.js");
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
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: CREATE CHAT SUCCESSFULLY
it("create chat successfully", async () => {
  const mockValue = {
    room: "roomId",
    sender: "userId",
    message: "message",
    media: "media",
  };

  Chat.create.mockResolvedValue(mockValue);

  await createChat(req, res, next);

  expect(sendNewPostIO).toHaveBeenCalledWith("roomId", mockValue);

  expect(Chat.create).toHaveBeenCalledWith({
    room: "roomId",
    sender: "userId",
    message: "message",
    media: "media",
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "Chat created",
  });

  // Verify next was not called (no error case)
  expect(next).not.toHaveBeenCalled();
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
