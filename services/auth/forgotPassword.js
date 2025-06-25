import getUserByEmail from "../../database/User/getUserByEmail.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import { setUserIdIntoRedis } from "../../redis/Auth/forgotPassword.js";
import sendingEmail from "../../utils/email/email.js";
import resetPasswordLinkTemplate from "../../utils/email/resetPasswordLinkTemplate.js";
import { environment } from "../../utils/environment.js";
import isLocalhostOrigin from "../../utils/isLocalhostOrigin.js";
import generateResetToken from "../../utils/javaScript/generateResetToken.js";

const forgotPassword = catchGraphQLError(async (parent, args, contextValue) => {
  const { email } = args;

  if (!email) {
    throw new Error("Email is not provided");
  }

  const findUser = await getUserByEmail(email);

  if (!findUser) {
    throw new Error("You are not our customer. Please signup first");
  }

  const secretToken = generateResetToken();

  const url = `${
    isLocalhostOrigin(req) || environment.CLIENT_URL
  }/newPassword?resetToken=${secretToken}`;
  // const url = `${environment.CLIENT_URL}/newPassword?resetToken=${secretToken}`;

  const html = resetPasswordLinkTemplate(url);

  await sendingEmail(email, "Reset Password Link", html);

  await setUserIdIntoRedis(secretToken, findUser._id);

  return "Reset Password link send to your email";
});

export default forgotPassword;
