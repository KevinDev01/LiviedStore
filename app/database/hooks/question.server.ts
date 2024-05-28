import { User } from "~/lib/types";
import db from "../db.server";

export async function create_question(
  question: string,
  user: User | null,
  product_id: string
) {
  const userData = user;
  if (userData === null) return null;
  return await db.question
    .create({
      data: {
        question,
        userId: userData.id,
        productId: product_id,
      },
    })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return null;
    });
}
