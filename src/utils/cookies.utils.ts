import { CookieOptions } from "express";
import config from "config";

export const accessTokenTtl = config.get<number>("accessTokenTtl");
export const refreshTokenTtl = config.get<number>("refreshTokenTtl");

export const accessTokenOptions: CookieOptions = {
  maxAge: accessTokenTtl,
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "strict",
  secure: false,
};

export const refreshTokenOptions = {
  ...accessTokenOptions,
  maxAge: refreshTokenTtl,
};
