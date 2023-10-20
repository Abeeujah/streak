import { Router } from "express";
import { httpSignUp, httpSignIn, httpSignOut } from "./auth.controller";

const authRouter = Router();

authRouter.post("/signup", httpSignUp);
authRouter.post("/signin", httpSignIn);
authRouter.delete("/signout", httpSignOut);

export default authRouter;
