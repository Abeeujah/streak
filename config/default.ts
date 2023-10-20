import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  salt: Number(process.env.SALT),
  accessTokenTtl: Number(process.env.ACCESS_TOKEN_TTL),
  refreshTokenTtl: Number(process.env.REFRESH_TOKEN_TTL),
  privateKey: process.env.PRIVATE_KEY,
};
