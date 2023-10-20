import bcrypt from "bcrypt";
import config from "config";
import db from "../../prisma/client";
import { omit } from "lodash";

// async function findUserById(id: number) {
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         id,
//       },
//     });

//     return user;
//   } catch (e: any) {}
// }

export async function findUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function signUp(email: string, password: string) {
  try {
    const salt = await bcrypt.genSalt(config.get<number>("salt"));

    const hash = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: { email, password: hash },
    });

    return omit(user, "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function comparePassword(user: any, password: string) {
  const result = await bcrypt.compare(password, user.password);

  return result;
}
