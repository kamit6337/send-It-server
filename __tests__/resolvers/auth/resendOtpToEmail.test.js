import { setUserOTPIntoRedis } from "../../../redis/Auth/signUp.js";
import resendOtpToEmail from "../../../services/auth/resendOtpToEmail.js";
import sendingEmail from "../../../utils/email/email.js";
import otpTemplate from "../../../utils/email/otpTemplate.js";
import generateOTP from "../../../utils/javaScript/generateOTP.js";

jest.mock("../../../redis/Auth/signUp.js");
jest.mock("../../../utils/email/email.js");
jest.mock("../../../utils/javaScript/generateOTP.js");

describe("resendOtpToEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passed successfully, resent otp to email", async () => {
    const otp = "123456";

    generateOTP.mockReturnValue(otp);
    sendingEmail.mockResolvedValue();
    setUserOTPIntoRedis.mockResolvedValue();

    const result = await resendOtpToEmail({}, { email: "email" }, {});

    expect(result).toEqual("Successfull Re-Send OTP to Email");

    const html = otpTemplate(otp);

    expect(sendingEmail).toHaveBeenCalledWith(
      "email",
      "OTP for verification",
      html
    );
    expect(setUserOTPIntoRedis).toHaveBeenCalledWith("email", otp);
  });

  it("failed, email is not provided", async () => {
    await expect(resendOtpToEmail({}, {}, {})).rejects.toThrow(
      "Something went wrong on resending OTP. Please try later"
    );
  });
});
