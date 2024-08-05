import generate8digitOTP from "./generate8digitOTP.js";

const createUserName = (name) => {
  if (!name) return;

  const firstName = name.split(" ")[0];
  const random8DigitNum = generate8digitOTP();
  return `${firstName}${random8DigitNum}`;
};

export default createUserName;
