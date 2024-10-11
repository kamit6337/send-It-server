import getChatPresignedUrl from "../../../controllers/file/getChatPresignedUrl.js";
import getPresignedThumbnailUrl from "../../../controllers/file/getPresignedThumbnailUrl.js";
import getPresignedUrl from "../../../controllers/file/getPresignedUrl.js";
import getProfileBgPresignedUrl from "../../../controllers/file/getProfileBgPresignedUrl.js";
import getProfilePresignedUrl from "../../../controllers/file/getProfilePresignedUrl.js";
import preSignedAWS from "../../../controllers/functions/preSignedAWS.js";

jest.mock("../../../controllers/functions/preSignedAWS.js");

let req, res, next;

beforeAll(() => {
  req = jest.fn();

  res = {
    json: jest.fn(),
  };

  next = jest.fn();
});

it("get chat presigned url", async () => {
  const response = {};

  preSignedAWS.mockResolvedValue(response);

  await getChatPresignedUrl(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    ...response,
  });

  expect(preSignedAWS).toHaveBeenCalledWith(req, res, next, {
    keyFolder: "chats",
  });
});

it("get thumbnail presigned url", async () => {
  const response = {};

  preSignedAWS.mockResolvedValue(response);

  await getPresignedThumbnailUrl(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    ...response,
  });

  expect(preSignedAWS).toHaveBeenCalledWith(req, res, next, {
    keyFolder: "thumbnails",
  });
});

it("get posts presigned url", async () => {
  const response = {};

  preSignedAWS.mockResolvedValue(response);

  await getPresignedUrl(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    ...response,
  });

  expect(preSignedAWS).toHaveBeenCalledWith(req, res, next, {
    keyFolder: "posts",
  });
});

it("get profile bg presigned url", async () => {
  const response = {};

  preSignedAWS.mockResolvedValue(response);

  await getProfileBgPresignedUrl(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    ...response,
  });

  expect(preSignedAWS).toHaveBeenCalledWith(req, res, next, {
    keyFolder: "profile-bg",
  });
});

it("get profile presigned url", async () => {
  const response = {};

  preSignedAWS.mockResolvedValue(response);

  await getProfilePresignedUrl(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    ...response,
  });

  expect(preSignedAWS).toHaveBeenCalledWith(req, res, next, {
    keyFolder: "profile",
  });
});
