import getUserByEmail from "../../../database/User/getUserByEmail.js";
import {
  setUserOTPIntoRedis,
  setUserSignupDataIntoRedis,
} from "../../../redis/Auth/signUp.js";
import makeUserSignUp from "../../../services/auth/makeUserSignUp.js";
import sendingEmail from "../../../utils/email/email.js";
import otpTemplate from "../../../utils/email/otpTemplate.js";
import generateOTP from "../../../utils/javaScript/generateOTP.js";

jest.mock("../../../database/User/getUserByEmail.js");
jest.mock("../../../redis/Auth/signUp.js");
jest.mock("../../../utils/email/email.js");
jest.mock("../../../utils/javaScript/generateOTP.js");

describe("makeUserSignUp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passed successfully, making user signup initial", async () => {
    getUserByEmail.mockResolvedValue(undefined);

    const otp = "123456";

    generateOTP.mockReturnValue(otp);
    sendingEmail.mockResolvedValue();
    setUserOTPIntoRedis.mockResolvedValue();
    setUserSignupDataIntoRedis.mockResolvedValue();

    const args = { name: "username", email: "email", password: "userPassword" };

    const obj = {
      name: "username",
      email: "email",
      password: "userPassword",
    };

    const html = otpTemplate(otp);

    const result = await makeUserSignUp({}, args, {});

    expect(result).toEqual("Successfull Send OTP to Email");
    expect(getUserByEmail).toHaveBeenCalledWith("email");
    expect(sendingEmail).toHaveBeenCalledWith(
      "email",
      "OTP for verification",
      html
    );
    expect(setUserOTPIntoRedis).toHaveBeenCalledWith("email", otp);
    expect(setUserSignupDataIntoRedis).toHaveBeenCalledWith("email", obj);
  });

  it("failed, args is not provided", async () => {
    const args1 = {
      name: "name",
    };
    const args2 = {
      email: "email",
    };
    const args3 = {
      password: "password",
    };

    await expect(makeUserSignUp({}, {}, {})).rejects.toThrow(
      "Not provided all field"
    );
    await expect(makeUserSignUp({}, args1, {})).rejects.toThrow(
      "Not provided all field"
    );
    await expect(makeUserSignUp({}, args2, {})).rejects.toThrow(
      "Not provided all field"
    );
    await expect(makeUserSignUp({}, args3, {})).rejects.toThrow(
      "Not provided all field"
    );
  });

  it("failed, user already present with given email", async () => {
    getUserByEmail.mockResolvedValue("user present");

    const args = { name: "username", email: "email", password: "userPassword" };

    await expect(makeUserSignUp({}, args, {})).rejects.toThrow(
      "You have already signed up with this Email ID. Please login or signup with different Email ID"
    );
  });
});
