import getUserByEmail from "../../../database/User/getUserByEmail.js";
import { setUserIdIntoRedis } from "../../../redis/Auth/forgotPassword.js";
import forgotPassword from "../../../services/auth/forgotPassword.js";
import sendingEmail from "../../../utils/email/email.js";
import resetPasswordLinkTemplate from "../../../utils/email/resetPasswordLinkTemplate.js";
import { environment } from "../../../utils/environment.js";
import generateResetToken from "../../../utils/javaScript/generateResetToken.js";

jest.mock("../../../database/User/getUserByEmail.js");
jest.mock("../../../redis/Auth/forgotPassword.js");
jest.mock("../../../utils/email/email.js");
jest.mock("../../../utils/javaScript/generateResetToken.js");

describe("forgotPassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passed successfully, forgot password", async () => {
    const findUser = {
      _id: "userId",
    };
    const secretToken = "fixedSecretToken";

    getUserByEmail.mockResolvedValue(findUser);
    sendingEmail.mockResolvedValue();
    setUserIdIntoRedis.mockResolvedValue();
    generateResetToken.mockReturnValue(secretToken);

    const args = { email: "email" };

    const result = await forgotPassword({}, args, {});

    const url = `${environment.CLIENT_URL}/newPassword?resetToken=${secretToken}`;
    const html = resetPasswordLinkTemplate(url);

    expect(result).toEqual("Reset Password link send to your email");
    expect(getUserByEmail).toHaveBeenCalledWith("email");
    expect(sendingEmail).toHaveBeenCalledWith(
      "email",
      "Reset Password Link",
      html
    );
    expect(setUserIdIntoRedis).toHaveBeenCalledWith(
      "fixedSecretToken",
      "userId"
    );
  });

  it("failed, if email is not provided", async () => {
    await expect(forgotPassword({}, {}, {})).rejects.toThrow(
      "Email is not provided"
    );
  });

  it("failed, not found user by email", async () => {
    getUserByEmail.mockResolvedValue(undefined);

    const args = { email: "email" };

    await expect(forgotPassword({}, args, {})).rejects.toThrow(
      "You are not our customer. Please signup first"
    );
  });
});
