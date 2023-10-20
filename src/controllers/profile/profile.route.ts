import { Router } from "express";
import upload from "../../middleware/image.middleware";
import { httpCreateProfile, httpGetAllProfiles } from "./profile.controller";

const profileRouter = Router();

profileRouter.post(
  "/create",
  upload.single("photo"),
  httpCreateProfile
);
profileRouter.get("/", httpGetAllProfiles);

export default profileRouter;
