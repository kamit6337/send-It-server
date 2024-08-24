import User from "../../../models/UserModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import {
  decrypt,
  encrypt,
} from "../../../utils/encryption/encryptAndDecrypt.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import createUserName from "../../../utils/javaScript/createUserName.js";
import Req from "../../../utils/Req.js";

const verifySignup = catchAsyncError(async (req, res, next) => {
  const { otp: userOtp } = req.body;

  if (!userOtp) {
    return next(
      new HandleGlobalError("OTP is not provided. Please provide it")
    );
  }

  const { _sig } = Req(req);

  if (!_sig) {
    return next(
      new HandleGlobalError("Something went wrong on Sign Up. Please try later")
    );
  }

  const { otp, name, email, password } = decrypt(_sig);

  if (otp !== +userOtp) {
    return next(
      new HandleGlobalError("OTP is incorrect. Please provide correct OTP")
    );
  }

  const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

  const userName = createUserName(name);

  const createUser = await User.create({
    name,
    username: userName,
    email,
    password,
    photo: profilePicUrl,
  });

  if (!createUser) {
    return next(
      new HandleGlobalError("Issue in Signup. Please try later", 404)
    );
  }

  const token = encrypt({
    id: createUser._id,
    role: createUser.role,
  });

  res.clearCookie("_sig", cookieOptions);

  res.cookie("_use", token, cookieOptions);

  // res.redirect(`${environment.CLIENT_URL}/flow?username=${userName}`);
  res.json({
    message: "User verified and account created",
    data: userName,
  });
});

export default verifySignup;
