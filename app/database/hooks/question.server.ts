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

export async function get_questions_and_product() {
  const [questions, categories] = await db.$transaction([
    db.question.findMany({
      select: {
        id: true,
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
    }),
    db.category.findMany({
      select: {
        id: true,
        name: true,
        subCategories: {
          select: {
            id: true,
            name: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);
  return { questions, categories };
}

export async function update_question(id: string, answer: string) {
  return await db.question
    .update({
      where: {
        id,
      },
      data: {
        answer,
      },
    })
    .then(() => {
      return { message: "Pregunta actualizada con éxito", type: "success" };
    })
    .catch((err) => {
      console.log(err);
      return { message: "La respuesta no fue enviada", type: "error" };
    });
}

export async function delete_question(id: string) {
  return await db.question
    .delete({
      where: {
        id,
      },
    })
    .then(() => {
      return { message: "Pregunta eliminada correctamente", type: "success" };
    })
    .catch((err) => {
      console.log(err);
      return { message: "La pregunta no pudo eliminarse", type: "error" };
    });
}
