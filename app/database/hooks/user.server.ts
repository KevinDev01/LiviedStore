import db from "../db.server";
import { User } from "~/lib/types";

export async function createUser(values: User) {
  const { email, name, password, lastname } = values;
  const userCreated = await db.user.create({
    data: {
      email,
      name,
      lastname,
      password,
    },
  });

  return userCreated;
}

export async function userFindByEmail(email: string) {
  const userFound = await db.user.findUnique({
    where: {
      email,
    },
  });
  return userFound;
}

export async function getUserByID(id: string) {
  const userFound = await db.user.findUnique({
    where: {
      id,
    },
  });
  return userFound;
}
