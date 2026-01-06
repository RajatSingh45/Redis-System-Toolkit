import crypto from "crypto";

const generateToken = () => {
  const token = crypto.randomBytes(32).toString("base64url");

  return token;
};

const generateHashKey = (token) => {
  const hashedKey = crypto.createHash("sha256").update(token).digest("hex");

  return hashedKey;
};

export { generateToken, generateHashKey };
