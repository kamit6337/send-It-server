import postCreateUser from "../../../database/User/postCreateUser.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import verifyOtp from "../../../lib/verifyOtp.js";
import { getUserSignUpDataRedis } from "../../../redis/Auth/signUp.js";
import makeUserSignUpFinal from "../../../services/auth/makeUserSignUpFinal.js";

jest.mock("../../../database/User/postCreateUser.js");
jest.mock("../../../lib/encryptAndDecrypt.js");
jest.mock("../../../lib/verifyOtp.js");
jest.mock("../../../redis/Auth/signUp.js");

describe("makeUserSignUpFinal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passed successfully, mak user signup final", async () => {
    const user = {
      name: "username",
      password: "userPassword",
    };

    const token = "userToken";

    const createUser = {
      _id: "userId",
      role: "user",
    };

    verifyOtp.mockResolvedValue();
    getUserSignUpDataRedis.mockResolvedValue(user);
    postCreateUser.mockResolvedValue(createUser);
    encrypt.mockReturnValue(token);

    const args = { email: "email", otp: "123456" };

    const result = await makeUserSignUpFinal({}, args, {});

    expect(result).toEqual(token);

    const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${user.name}&size=128&bold=true`;

    const obj = {
      name: "username",
      email: "email",
      password: "userPassword",
      photo: profilePicUrl,
    };

    expect(verifyOtp).toHaveBeenCalledWith("email", "123456");
    expect(getUserSignUpDataRedis).toHaveBeenCalledWith("email");
    expect(postCreateUser).toHaveBeenCalledWith(obj);
    expect(encrypt).toHaveBeenCalledWith({
      id: "userId",
      role: "user",
    });
  });

  it("failed, user not found from redis", async () => {
    verifyOtp.mockResolvedValue();

    getUserSignUpDataRedis.mockResolvedValue(undefined);

    const args = { email: "email", otp: "123456" };

    await expect(makeUserSignUpFinal({}, args, {})).rejects.toThrow(
      "Something went wrong in signup. Please try later"
    );
  });

  it("failed, issue in create user", async () => {
    const user = {
      name: "username",
      password: "userPassword",
    };

    verifyOtp.mockResolvedValue();
    getUserSignUpDataRedis.mockResolvedValue(user);
    postCreateUser.mockResolvedValue(undefined);

    const args = { email: "email", otp: "123456" };

    await expect(makeUserSignUpFinal({}, args, {})).rejects.toThrow(
      "Issue in Signup. Please try later"
    );
  });
});
