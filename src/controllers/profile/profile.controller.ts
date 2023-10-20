import { Request, Response } from "express";
import { z } from "zod";
import { findUserByEmail } from "../../services/auth.service";
import createProfile, {
  retrieveProfiles,
} from "../../services/profile.service";
import sendMail from "../../utils/mail.util";

const profileSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function httpCreateProfile(req: Request, res: Response) {
  if (!req.user && !res.locals.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = req.user || res.locals.user;

  if (!req.file) {
    return res.status(400).json({ error: "Incomplete payload" });
  }

  const validation = profileSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Bad request" });
  }

  try {
    const validUser = await findUserByEmail(user.email);
    if (!validUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const profileData = {
      name: req.body.name,
      userId: validUser.id,
      picture:
        req.protocol +
        "://" +
        req.get("host") +
        "/uploads/" +
        req.file.filename,
    };

    const profile = await createProfile(profileData);

    sendMail({ email: validUser.email, subject: "profile" });

    return res.status(201).json(profile);
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function httpGetAllProfiles(req: Request, res: Response) {
  try {
    const profiles = await retrieveProfiles();
    return res.status(200).json(profiles);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
