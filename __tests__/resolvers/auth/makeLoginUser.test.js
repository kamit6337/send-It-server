import getUserByEmail from "../../../database/User/getUserByEmail.js";
import { verifyUserPassword } from "../../../lib/bcrypt.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import makeLoginUser from "../../../services/auth/makeLoginUser.js";

jest.mock("../../../database/User/getUserByEmail.js");
jest.mock("../../../lib/bcrypt.js");
jest.mock("../../../lib/encryptAndDecrypt.js");

describe("makeLoginUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passed successfully, making login user", async () => {
    const findUser = {
      _id: "userId",
      password: "userPassword",
      role: "user",
    };

    const token = "token";

    getUserByEmail.mockResolvedValue(findUser);

    verifyUserPassword.mockResolvedValue(true);

    encrypt.mockReturnValue(token);

    const result = await makeLoginUser(
      {},
      {
        email: "email",
        password: "password",
      },
      {}
    );

    expect(result).toEqual(token);
    expect(getUserByEmail).toHaveBeenCalledWith("email");
    expect(verifyUserPassword).toHaveBeenCalledWith(
      findUser.password,
      "password"
    );
    expect(encrypt).toHaveBeenCalledWith({
      id: findUser._id,
      role: findUser.role,
    });
  });

  it("failed, when args/partial args is not provided", async () => {
    await expect(makeLoginUser({}, { email: "email" }, {})).rejects.toThrow(
      "Email or Password is not provided"
    );

    await expect(
      makeLoginUser({}, { password: "password" }, {})
    ).rejects.toThrow("Email or Password is not provided");

    await expect(makeLoginUser({}, {}, {})).rejects.toThrow(
      "Email or Password is not provided"
    );
  });

  it("failed, user not found with given email", async () => {
    getUserByEmail.mockResolvedValue(undefined);

    await expect(
      makeLoginUser({}, { email: "email", password: "password" }, {})
    ).rejects.toThrow("Email or Password is incorrect");
  });

  it("failed, user password not found with given email", async () => {
    const findUser = {
      _id: "userId",
      email: "email",
    };

    getUserByEmail.mockResolvedValue(findUser);

    await expect(
      makeLoginUser({}, { email: "email", password: "password" }, {})
    ).rejects.toThrow("Please reset your password to login");
  });

  it("failed, password verification failed", async () => {
    const findUser = {
      _id: "userId",
      email: "email",
      password: "userPassword",
    };

    getUserByEmail.mockResolvedValue(findUser);

    verifyUserPassword.mockResolvedValue(false);

    await expect(
      makeLoginUser({}, { email: "email", password: "password" }, {})
    ).rejects.toThrow("Email or Password is incorrect");
  });
});
