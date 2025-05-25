import catchGraphQLError from "../../lib/catchGraphQLError.js";
import getUserByEmail from "../../database/User/getUserByEmail.js";
import otpTemplate from "../../utils/email/otpTemplate.js";
import sendingEmail from "../../utils/email/email.js";
import generateOTP from "../../utils/javaScript/generateOTP.js";
import {
  setUserOTPIntoRedis,
  setUserSignupDataIntoRedis,
} from "../../redis/Auth/signUp.js";

const makeUserSignUp = catchGraphQLError(async (parent, args, contextValue) => {
  const { name, email, password } = args;

  if (!name || !email || !password) {
    throw new Error("Not provided all field");
  }

  // MARK: CHECK USER IS ALREADY PRESENT OR NOT
  const findUser = await getUserByEmail(email);

  if (findUser) {
    throw new Error(
      "You have already signed up with this Email ID. Please login or signup with different Email ID"
    );
  }

  const otp = generateOTP();

  const html = otpTemplate(otp);

  const obj = {
    name,
    email,
    password,
  };
  await sendingEmail(email, "OTP for verification", html);

  await setUserOTPIntoRedis(email, otp);
  await setUserSignupDataIntoRedis(email, obj);

  return "Successfull Send OTP to Email";
});

export default makeUserSignUp;
