import Req from "../../../utils/Req.js";
import {
  decrypt,
  encrypt,
} from "../../../utils/encryption/encryptAndDecrypt.js";

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
});
