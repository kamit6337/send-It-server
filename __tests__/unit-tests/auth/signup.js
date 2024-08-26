import signup from "../../../controllers/auth/signup/signup.js";
import User from "../../../models/UserModel.js";
import sendingEmail from "../../../utils/email/email.js";
import otpTemplate from "../../../utils/email/otpTemplate.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import generate8digitOTP from "../../../utils/javaScript/generate8digitOTP.js";

jest.mock("../../../models/UserModel.js");
jest.mock("../../../utils/email/email.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../utils/javaScript/generate8digitOTP.js");

let req, res, next;

beforeEach(() => {
  req = {
    body: {
      name: "user",
      email: "user@gmail.com",
      password: "user1234",
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: USER SIGNED UP SUCCESSFULLY
it("user signup successfully", async () => {
  User.findOne.mockResolvedValue(null);

  sendingEmail.mockResolvedValue("success");

  encrypt.mockReturnValue("encryptedData");

  const otp = 45896587;

  generate8digitOTP.mockReturnValue(otp);

  const html = otpTemplate(otp);

  await signup(req, res, next);

  expect(sendingEmail).toHaveBeenCalledWith(
    "user@gmail.com",
    "OTP for verification",
    html
  );

  // Ensure the cookie is set with the correct token
  expect(res.cookie).toHaveBeenCalledWith(
    "_sig",
    "encryptedData",
    expect.any(Object)
  );

  expect(res.json).toHaveBeenCalledWith({
    message: "Successfull Send OTP to Email",
  });
});

// NOTE: FAILED, EMPTY REQ.BODY
it("failed, req.body is empty", async () => {
  req.body = {};

  await signup(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Not provided all field",
    })
  );
});

// NOTE: FAILED, USER ALREADY EXISTS
it("failed, user already exists", async () => {
  User.findOne.mockResolvedValue("success");

  await signup(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message:
        "You have already signed up with this Email ID. Please login or signup with different Email ID",
    })
  );
});