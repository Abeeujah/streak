import db from "../../prisma/client";

export interface Profile {
  name: string;
  userId: string;
  picture: string;
}

async function createProfile(user: Profile) {
  const { name, picture, userId } = user;
  try {
    const profile = await db.profile.create({
      data: { name, userId, picture },
    });
    return profile;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function retrieveProfiles() {
  const profiles = await db.profile.findMany();

  return profiles;
}

export default createProfile;
