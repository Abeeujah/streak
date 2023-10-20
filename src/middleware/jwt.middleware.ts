import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUserByEmail } from "../services/auth.service";
import { accessTokenOptions, accessTokenTtl } from "../utils/cookies.utils";

export async function reissueAccessToken(jwt: string) {
  const { decoded } = verifyJwt(jwt);

  if (!decoded || !get(decoded, "email")) {
    return false;
  }

  const { email } = decoded;

  const validUser = await findUserByEmail(email);

  if (!validUser) {
    return false;
  }

  const accessToken = signJwt(decoded, { expiresIn: accessTokenTtl });
  return accessToken;
}

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("I was called");
  const accessToken = get(req, "cookies.accessToken");
  const refreshToken = get(req, "cookies.refreshToken");

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    const { email } = decoded;
    const exists = await findUserByEmail(email);

    if (!exists) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = decoded;
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const renewToken = reissueAccessToken(refreshToken);
    res.cookie("accessToken", renewToken, accessTokenOptions);
    const result = verifyJwt(renewToken);
    req.user = result.decoded;
    res.locals.user = decoded;
    return next();
  }

  return next();
}

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req;

  const validUser = await findUserByEmail(user.email);

  if (!user && !validUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}
