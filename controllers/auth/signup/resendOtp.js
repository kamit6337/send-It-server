import { sendEmailAsync } from "../../../BullMQ/otp/otpQueue.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import {
  decrypt,
  encrypt,
} from "../../../utils/encryption/encryptAndDecrypt.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import generate8digitOTP from "../../../utils/javaScript/generate8digitOTP.js";
import Req from "../../../utils/Req.js";

const resendOtp = catchAsyncError(async (req, res, next) => {
  const { _sig } = Req(req);

  if (!_sig) {
    return next(
      new HandleGlobalError(
        "Something went wrong on resending OTP. Please try later"
      )
    );
  }

  const { name, email, password } = decrypt(_sig);

  const newOtp = generate8digitOTP();

  await sendEmailAsync(email, newOtp);

  const token = encrypt({
    otp: newOtp,
    name,
    email,
    password,
  });

  res.cookie("_sig", token, cookieOptions);

  res.status(200).json({
    message: "Successfull Re-Send OTP to Email",
  });
});
export default resendOtp;
