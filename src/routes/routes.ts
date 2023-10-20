import { Router } from "express";
import authRouter from "../controllers/auth/auth.route";
import profileRouter from "../controllers/profile/profile.route";
import { deserializeUser, requireUser } from "../middleware/jwt.middleware";

const api = Router();

api.use("/auth", authRouter);
api.use("/profile", deserializeUser, requireUser, profileRouter);

export default api;
