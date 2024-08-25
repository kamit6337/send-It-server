import protectRoute from "../../../middlewares/protectRoute.js";
import User from "../../../models/UserModel.js";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import Req from "../../../utils/Req.js";

jest.mock("../../../models/UserModel.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../utils/Req.js");

let req, res, next;

beforeEach(() => {
  req = {};
  res = {};
  next = jest.fn();
});

// NOTE: PROCEED TO NEXT SUCCESSFULLY
it("proceed to next successfully", async () => {
  Req.mockReturnValue({
    _use: "userToken",
  });

  decrypt.mockReturnValue({
    id: "userId",
  });

  User.findById.mockResolvedValue({
    _id: "userId",
    name: "user name",
    email: "user@gmail.com",
  });

  await protectRoute(req, res, next);

  expect(req.userId).toBe("userId");
  expect(req.user).toEqual({
    _id: "userId",
    name: "user name",
    email: "user@gmail.com",
  });

  expect(next).toHaveBeenCalled();
});

// NOTE: FAILED, DUE TO EMPTY REQ
it("failed, due to empty Req", async () => {
  Req.mockReturnValue({});

  await protectRoute(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please Login Again...",
    })
  );
});

// NOTE: FAILED, DUE TO NOT FIND USER
it("failed, due to not find user", async () => {
  Req.mockReturnValue({
    _use: "userToken",
  });

  decrypt.mockReturnValue({
    id: "userId",
  });

  User.findById.mockResolvedValue(null);

  await protectRoute(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "UnAuthorized Access. You are not our User",
    })
  );
});
