import catchGraphQLError from "../../lib/catchGraphQLError.js";
import otpTemplate from "../../utils/email/otpTemplate.js";
import sendingEmail from "../../utils/email/email.js";
import generateOTP from "../../utils/javaScript/generateOTP.js";
import { setUserOTPIntoRedis } from "../../redis/Auth/signUp.js";

const resendOtpToEmail = catchGraphQLError(
  async (parent, args, contextValue) => {
    const { email } = args;

    if (!email) {
      throw new Error(
        "Something went wrong on resending OTP. Please try later"
      );
    }

    const newOtp = generateOTP();

    const html = otpTemplate(newOtp);

    await sendingEmail(email, "OTP for verification", html);

    await setUserOTPIntoRedis(email, newOtp);

    return "Successfull Re-Send OTP to Email";
  }
);

export default resendOtpToEmail;
