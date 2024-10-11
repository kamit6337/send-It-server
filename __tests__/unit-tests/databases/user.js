import checkUserExistWithSameUsername from "../../../database/User/checkUserExistWithSameUsername.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import getUserById from "../../../database/User/getUserById.js";
import getUserBySearch from "../../../database/User/getUserBySearch.js";
import getUserByUsername from "../../../database/User/getUserByUsername.js";
import patchUserProfile from "../../../database/User/patchUserProfile.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import User from "../../../models/UserModel.js";

jest.mock("../../../models/UserModel.js");

// NOTE: CHECK USER EXISTS WITH SAME USERNAME
describe("check user exists with same username", () => {
  it("same username exist", async () => {
    User.exists.mockResolvedValue(true);

    const result = await checkUserExistWithSameUsername("userId", "username");

    expect(result).toBe(true);

    expect(User.exists).toHaveBeenCalledWith({
      _id: { $ne: "userId" },
      username: "username",
    });
  });

  it("same username does not exists", async () => {
    User.exists.mockResolvedValue(false);

    const result = await checkUserExistWithSameUsername("userId", "username");

    expect(result).toBe(false);

    expect(User.exists).toHaveBeenCalledWith({
      _id: { $ne: "userId" },
      username: "username",
    });
  });
});

// NOTE: GETTING USER BY EMAIL
describe("getting user by email", () => {
  it("get user by email", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };

    const select = jest.fn().mockResolvedValue(mockUser);

    User.findOne.mockReturnValue({
      select,
    });

    const email = "test@example.com";

    const result = await getUserByEmail(email);

    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ email });
  });

  it("not get user by email", async () => {
    const select = jest.fn().mockResolvedValue(null);

    User.findOne.mockReturnValue({
      select,
    });

    const email = "test@example.com";

    const result = await getUserByEmail(email);

    expect(result).toEqual(null);
    expect(User.findOne).toHaveBeenCalledWith({ email });
  });
});

// NOTE: GETTING USER BY ID
describe("getting user by Id", () => {
  it("get user by Id", async () => {
    const mockUser = { name: "Amit", role: "user" };

    User.findOne.mockResolvedValue(mockUser);

    const userId = "userid";

    const result = await getUserById(userId);

    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({
      _id: userId,
    });
  });

  it("not get user by Id", async () => {
    User.findOne.mockResolvedValue(null);

    const userId = "userid";

    const result = await getUserById(userId);

    expect(result).toEqual(null);
    expect(User.findOne).toHaveBeenCalledWith({
      _id: userId,
    });
  });
});

// NOTE: GETTING USER BY SEARCH
describe("getting User By Search", () => {
  it("get user by search", async () => {
    const mockUser = { name: "Amit", role: "user" };

    User.find.mockResolvedValue(mockUser);

    const search = "amit";
    const userId = "userId";

    const result = await getUserBySearch(userId, search);

    expect(result).toEqual(mockUser);
    expect(User.find).toHaveBeenCalledWith({
      $or: [
        { name: { $regex: new RegExp(search, "i") } },
        { username: { $regex: new RegExp(search, "i") } },
      ],
      _id: { $ne: userId },
    });
  });

  it("not getting user by search", async () => {
    User.find.mockResolvedValue(null);

    const search = "amit";
    const userId = "userId";

    const result = await getUserBySearch(userId, search);

    expect(result).toEqual(null);
    expect(User.find).toHaveBeenCalledWith({
      $or: [
        { name: { $regex: new RegExp(search, "i") } },
        { username: { $regex: new RegExp(search, "i") } },
      ],
      _id: { $ne: userId },
    });
  });
});

// NOTE: GETTING USER BY USERNAME
describe("getting user by Username", () => {
  it("get user by Username", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };

    const select = jest.fn().mockResolvedValue(mockUser);

    User.findOne.mockReturnValue({
      select,
    });

    const username = "amit12334";

    const result = await getUserByUsername(username);

    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ username });
  });

  it("not get user by Username", async () => {
    const select = jest.fn().mockResolvedValue(null);

    User.findOne.mockReturnValue({
      select,
    });

    const username = "amit12334";

    const result = await getUserByEmail(username);

    expect(result).toEqual(null);
    expect(User.findOne).toHaveBeenCalledWith({ username });
  });
});

// NOTE: PATCH USER PROFILE
describe("update user profile", () => {
  it("successfully update user profile", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };

    User.findOneAndUpdate.mockReturnValue(mockUser);

    const obj = {};
    const userId = "amit1234";

    const result = await patchUserProfile(userId, obj);

    expect(result).toEqual(mockUser);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: userId,
      },
      {
        ...obj,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  });

  it("failed user update", async () => {
    User.findOneAndUpdate.mockReturnValue(null);

    const obj = {};
    const userId = "amit1234";

    const result = await patchUserProfile(userId, obj);

    expect(result).toEqual(null);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: userId,
      },
      {
        ...obj,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  });
});

// NOTE: CREATE NEW USER
describe("create new user", () => {
  it("successfully create new user", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };

    User.create.mockReturnValue(mockUser);

    const obj = {};

    const result = await postCreateUser(obj);

    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith({
      ...obj,
    });
  });

  it("failed create new user", async () => {
    User.create.mockReturnValue(null);

    const obj = {};

    const result = await postCreateUser(obj);

    expect(result).toEqual(null);
    expect(User.create).toHaveBeenCalledWith({
      ...obj,
    });
  });
});
