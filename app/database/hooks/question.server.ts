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

export async function get_questions() {
  return await db.question
    .findMany({
      select: {
        answer: true,
        question: true,
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        createdAt: true,
      },
    })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return null;
    });
}
