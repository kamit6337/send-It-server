import updateUserProfile from "../../../controllers/auth/general/updateUserProfile.js";
import User from "../../../models/UserModel.js";

jest.mock("../../../models/UserModel.js");

describe("check user profile update", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        id: "user1234",
        name: "user",
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  //   NOTE: USER UPDATE SUCCESSFULLY
  it("update user profile successfully", async () => {
    User.findOneAndUpdate.mockResolvedValue({
      _id: "user1234",
      name: "user",
      email: "user@gmail.com",
      role: "user",
    });

    await updateUserProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "User profile has been updated",
      data: {
        _id: "user1234",
        name: "user",
        email: "user@gmail.com",
        role: "user",
      },
    });
  });

  //   NOTE: USER UPDATE FAILED SUCCESSFULLY
  it("update user profile failed successfully", async () => {
    req.body = {};

    await updateUserProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Not provided all field",
      })
    );
  });
});
