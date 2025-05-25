import getUserById from "../../database/User/getUserById.js";
import { decrypt } from "../../lib/encryptAndDecrypt.js";
import Req from "../../lib/Req.js";

jest.mock("../../database/User/getUserById.js");
jest.mock("../../lib/encryptAndDecrypt.js");

describe("Req", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("successfuly, return findUser when regular http request", async () => {
    const userToken = "userToken";

    const req = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    decrypt.mockReturnValue({
      id: "userId",
      exp: Date.now() + 100000000,
      iat: Date.now(),
    });

    const findUser = {
      id: "userId",
      passwordLastUpdated: Date.now() - 100000000,
    };

    getUserById.mockResolvedValue(findUser);

    const result = await Req(req);

    expect(decrypt).toHaveBeenCalledWith(userToken);
    expect(getUserById).toHaveBeenCalledWith("userId");
    expect(result).toEqual(findUser);
  });

  it("successfuly, return findUser when making Socket request", async () => {
    const userToken = "userToken";

    const req = {
      auth: {
        token: `Bearer ${userToken}`,
      },
    };

    decrypt.mockReturnValue({
      id: "userId",
      exp: Date.now() + 100000000,
      iat: Date.now(),
    });

    const findUser = {
      id: "userId",
      passwordLastUpdated: Date.now() - 100000000,
    };

    getUserById.mockResolvedValue(findUser);

    const result = await Req(req, true);

    expect(decrypt).toHaveBeenCalledWith(userToken);
    expect(getUserById).toHaveBeenCalledWith("userId");
    expect(result).toEqual(findUser);
  });

  it("throw error when req is not provided", async () => {
    await expect(Req()).rejects.toThrow(
      "Something went wrong. Please try later"
    );
  });

  it("throw error when req.headers is not provided", async () => {
    await expect(Req("hello")).rejects.toThrow(
      "Something went wrong. Please try later"
    );
  });

  it("throw error when req.headers.authorization is not provided", async () => {
    const req = {
      headers: "headers",
    };

    await expect(Req(req)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );
  });

  it("throw error when authorization is not starts with Bearer is not provided", async () => {
    const req = {
      headers: {
        authorization: "Bearer",
      },
    };

    await expect(Req(req)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );
  });

  it("throw error when req.auth is not provided", async () => {
    await expect(Req("hello", true)).rejects.toThrow(
      "Something went wrong. Please try later"
    );
  });

  it("throw error when token is not provided", async () => {
    const req = {
      auth: "auth",
    };

    await expect(Req(req, true)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );
  });

  it("throw error when token not starts with Bearer is not provided", async () => {
    const req = {
      auth: {
        token: "Bearer",
      },
    };

    await expect(Req(req, true)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );
  });

  it("throw error when UserToken is not provided", async () => {
    const reqSocket = {
      auth: {
        token: "Bearer ",
      },
    };

    const req = {
      headers: {
        authorization: "Bearer ",
      },
    };

    await expect(Req(req)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );

    await expect(Req(reqSocket, true)).rejects.toThrow(
      "Your do not have active session. Please Login"
    );
  });

  it("throw error, if not able to findUser", async () => {
    const userToken = "userToken";

    const req = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    decrypt.mockReturnValue({
      id: "userId",
      exp: Date.now() + 100000000,
      iat: Date.now(),
    });

    getUserById.mockResolvedValue(undefined);

    await expect(Req(req)).rejects.toThrow(
      "UnAuthorised Access. Please login again"
    );

    expect(getUserById).toHaveBeenCalledWith("userId");
  });

  it("throw error, if user session expired", async () => {
    const userToken = "userToken";

    const req = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    decrypt.mockReturnValue({
      id: "userId",
      exp: Date.now() + 180000, // 30 miutes = 18,00,000
      iat: Date.now(),
    });

    const findUser = {
      id: "userId",
      passwordLastUpdated: Date.now() - 100000000,
    };

    getUserById.mockResolvedValue(findUser);

    await expect(Req(req)).rejects.toThrow(
      "Your Session has expired. Please Login Again."
    );
  });

  it("throw error, if user recently updated his password", async () => {
    const userToken = "userToken";

    const req = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    decrypt.mockReturnValue({
      id: "userId",
      iat: Date.now() - 100000000,
      exp: Date.now() + 180000000, // 30 miutes = 18,00,000
    });

    const findUser = {
      id: "userId",
      passwordLastUpdated: Date.now(),
    };

    getUserById.mockResolvedValue(findUser);

    await expect(Req(req)).rejects.toThrow("Please login again...");
  });
});
