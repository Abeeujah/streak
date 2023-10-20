import { Request, Response } from "express";
import { z } from "zod";
import {
  signUp,
  findUserByEmail,
  comparePassword,
} from "../../services/auth.service";
import { signJwt, verifyJwt } from "../../utils/jwt.utils";
import {
  accessTokenOptions,
  accessTokenTtl,
  refreshTokenOptions,
  refreshTokenTtl,
} from "../../utils/cookies.utils";
import sendMail from "../../utils/mail.util";

const signUpSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(4).max(255),
});

export async function httpSignUp(req: Request, res: Response) {
  const validation = signUpSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { email, password } = req.body;

  try {
    const createdUser = await signUp(email, password);

    sendMail({ email, subject: "registration" });

    const accessToken = signJwt(createdUser, { expiresIn: accessTokenTtl });
    res.cookie("accessToken", accessToken, accessTokenOptions);

    const refreshToken = signJwt(createdUser, { expiresIn: refreshTokenTtl });
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    return res.status(201).json({ createdUser, accessToken, refreshToken });
  } catch (e) {
    return res.status(500).json(e.message);
  }
}

export async function httpSignIn(req: Request, res: Response) {
  const validation = signUpSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  const identity = await comparePassword(user, password);

  if (!identity) {
    return res.status(403).json({ error: "Invalid credentials provided" });
  }

  const accessToken = signJwt(user, { expiresIn: accessTokenTtl });
  res.cookie("accessToken", accessToken, accessTokenOptions);

  const refreshToken = signJwt(user, { expiresIn: refreshTokenTtl });
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.status(200).json({ accessToken, refreshToken });
}

export async function httpSignOut(req: Request, res: Response) {
  const { user } = req;

  if (!req) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = null;
  res.locals.user = null;
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });

  return res.status(200).json({ success: "Logout successful" });
}
