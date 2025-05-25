import patchUserProfile from "../../../database/User/patchUserProfile.js";
import {
  deleteKeyFromRedis,
  getUserIdFromRedis,
} from "../../../redis/Auth/forgotPassword.js";
import newPassword from "../../../services/auth/newPassword.js";

jest.mock("../../../database/User/patchUserProfile.js");
jest.mock("../../../redis/Auth/forgotPassword.js");

describe("newPassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("passed successfully, new password", async () => {
    const fixedTime = 1748210377981;
    jest.spyOn(Date, "now").mockReturnValue(fixedTime);

    getUserIdFromRedis.mockResolvedValue("userId");

    patchUserProfile.mockResolvedValue();
    deleteKeyFromRedis.mockResolvedValue();

    const args = {
      resetToken: "resetToken",
      password: "userPassword",
    };

    const result = await newPassword({}, args, {});

    const obj = {
      password: "userPassword",
      updatedAt: fixedTime,
    };

    expect(result).toEqual("Password has been updated");
    expect(getUserIdFromRedis).toHaveBeenCalledWith("resetToken");
    expect(patchUserProfile).toHaveBeenCalledWith("userId", obj);
    expect(deleteKeyFromRedis).toHaveBeenCalledWith("resetToken");
  });

  it("failed, args is not provided", async () => {
    await expect(newPassword({}, {}, {})).rejects.toThrow(
      "ResetToken and Password is required"
    );
  });

  it("failed, not able to get userId from Redis", async () => {
    getUserIdFromRedis.mockResolvedValue(undefined);

    const args = {
      resetToken: "resetToken",
      password: "userPassword",
    };

    await expect(newPassword({}, args, {})).rejects.toThrow(
      "Issue in Resetting Password. Try again later"
    );
  });
});
