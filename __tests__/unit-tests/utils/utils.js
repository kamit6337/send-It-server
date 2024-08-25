import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Req from "../../../utils/Req.js";
import {
  decrypt,
  encrypt,
} from "../../../utils/encryption/encryptAndDecrypt.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { environment } from "../../../utils/environment.js";
import preSignedAWS from "../../../controllers/functions/preSignedAWS.js";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("check all utils functions", () => {
  // NOTE: CHECK REQ FUNCTION
  describe("check Req functions", () => {
    it("Req function return single cookie successfully", () => {
      const req = {
        headers: {
          cookie: "sessionId=ndndsfkjdsfnsd",
        },
      };

      const result = Req(req);

      expect(result).toEqual({
        sessionId: "ndndsfkjdsfnsd",
      });
    });

    it("Req function return double cookie successfully", () => {
      const req = {
        headers: {
          cookie: "sessionId=ndndsfkjdsfnsd; cookieId=vkjdfnvkjdfn",
        },
      };

      const result = Req(req);

      expect(result).toEqual({
        sessionId: "ndndsfkjdsfnsd",
        cookieId: "vkjdfnvkjdfn",
      });
    });

    it("Req function failed when cookie not present", () => {
      const req = {
        headers: {},
      };

      const result = () => Req(req);

      expect(result).toThrow("Your do not have active session. Please Login");
    });
  });

  // NOTE: CHECK ENCRYPT AND DECRYPT FUNCTION
  describe("check Encrypt and Decrypt function", () => {
    it("encrypt and decrypt successfully", () => {
      const obj = {
        id: "user123",
        role: "user",
      };

      const encrypted = encrypt(obj);

      const result = decrypt(encrypted);

      expect(result.id).toBe("user123");
      expect(result.role).toBe("user");
    });

    it("decrypt failed", () => {
      const obj = {
        id: "user123",
        role: "user",
      };

      const result = () => decrypt(JSON.stringify(obj));
      const result2 = () => decrypt(null);

      expect(result).toThrow("Please login again...");
      expect(result2).toThrow("Please login again...");
    });
  });

  // NOTE: CHECK AWS PRE-SIGNED URL
  it("aws pre-signed url created successfully", async () => {
    const fileType = "image/png";
    const keyFolder = "posts";

    const req = {
      body: {
        fileType: fileType,
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock Date.now() to return a fixed value for testing
    const mockTimestamp = 1724586813125; // Replace with the actual timestamp you received in the test
    jest.spyOn(Date, "now").mockReturnValue(mockTimestamp);

    const file = fileType.split("/");
    const fileKey = `${keyFolder}/${file[0]}-${mockTimestamp}.${file[1]}`;

    const command = {
      middlewareStack: {},
      input: {
        Bucket: environment.AWS_S3_BUCKET,
        Key: fileKey,
        ContentType: fileType,
        ACL: "public-read",
      },
    };

    PutObjectCommand.mockResolvedValue(command);

    const url = "https://aws.com";
    getSignedUrl.mockResolvedValue(url);

    expect(await preSignedAWS(req, res, next, { keyFolder })).toEqual({
      url,
      fileType,
      fileKey,
    });
  });

  // NOTE: FAILED: DUE TO NOT PRESENT OF FILETYPE
  it("failed, due to not present of filetype", async () => {
    const keyFolder = "posts";

    const req = {
      body: {},
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const next = jest.fn();

    await preSignedAWS(req, res, next, { keyFolder });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "FileType must be provided",
      })
    );
  });
});
