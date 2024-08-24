import login from "../../../controllers/auth/login/login.js";
import User from "../../../models/UserModel.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";

jest.mock("../../../models/UserModel.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");

let req, res, next;

beforeEach(() => {
  req = {
    body: {
      email: "user@gmail.com",
      password: "hashedpassword",
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: SUCCESSFULLY SEND EMAIL
it("send email successfully", async () => {
  const findUser = {
    _id: "userId",
    role: "user",
    password: "hashedpassword",
    checkPassword: jest.fn().mockReturnValue(true),
    select: jest.fn().mockResolvedValue(true),
  };

  User.findOne.mockReturnValue({
    select: jest.fn().mockResolvedValue(findUser),
  });

  encrypt.mockReturnValue("encrypted");

  await login(req, res, next);

  expect(res.cookie).toHaveBeenCalledWith(
    "_use",
    "encrypted",
    expect.any(Object)
  );

  expect(res.json).toHaveBeenCalledWith({
    message: "Login Successfully",
  });
});

// NOTE: FAILED, DUE TO NOT PRESENT OF EMAIL or PASSWORD
it("failed, not present of email or password", async () => {
  req.body = {};

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is not provided",
    })
  );
});

// NOTE: FAILED, DUE TO NOT FIND USER BASED ON EMAIL
it("failed, not find user based on email", async () => {
  User.findOne.mockReturnValue({
    select: jest.fn().mockResolvedValue(null),
  });

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is incorrect",
    })
  );
});

// NOTE: FAILED, DUE TO NOT HAVE USER PASSWORD
it("failed, not find user based on email", async () => {
  const findUser = {
    password: null,
    checkPassword: jest.fn().mockReturnValue(false),
    select: jest.fn().mockResolvedValue(true),
  };

  User.findOne.mockReturnValue({
    select: jest.fn().mockResolvedValue(findUser),
  });

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please reset your password to login",
    })
  );
});

// NOTE: FAILED, DUE TO PASSWORD DOES NOT MATCH
it("failed, due to password does not match", async () => {
  const findUser = {
    password: "hashedpassword",
    checkPassword: jest.fn().mockReturnValue(false),
    select: jest.fn().mockResolvedValue(true),
  };

  User.findOne.mockReturnValue({
    select: jest.fn().mockResolvedValue(findUser),
  });

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is incorrect",
    })
  );
});
