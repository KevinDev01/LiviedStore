import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "./session.server";
import jwt from "jsonwebtoken";
import { User } from "~/lib/types";
import { getUserByID } from "~/database/hooks/user.server";

export async function getUserBySession(request: Request): Promise<User | null> {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("token")) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        session.data.token as string,
        process.env.SECRET_KEY as string,
        (err, decoded) => {
          if (err) {
            console.log(err);
            reject(null);
          }
          resolve(decoded as User);
        }
      );
    });
  }
  return null;
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function isAdmin(user: User) {
  const userFound = await getUserByID(user.id);
  if (userFound?.role !== "ADMIN") return redirect("/");
  return null;
}
