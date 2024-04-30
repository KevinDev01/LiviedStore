import { json } from "@remix-run/node";
import db from "../db.server";
import { createSubcategories } from "./subcategory.sever";

type SubCategory = Record<string, string | boolean>;

export async function createCategory(name: string) {
  let categoryCreated;
  try {
    categoryCreated = await db.category.create({
      data: {
        name,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
  return categoryCreated;
}

export async function updateCategory(
  id: string,
  name: string,
  fields: SubCategory[],
  features: string[]
) {
  let categoryUpdated;
  try {
    if (fields.length > 0) await createSubcategories(fields);
    categoryUpdated = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        features: features,
      },
    });
    return json({ message: "Categoria actualizada" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return null;
  }
  return categoryUpdated;
}

export async function getCategories() {
  const allCategories = await db.category.findMany({
    include: {
      subCategories: true,
    },
  });
  return allCategories;
}

export async function getCategory(id: string) {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
      include: {
        subCategories: true,
      },
    });
    return category;
  } catch (error) {
    return null;
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    return new Error("Ups! algo salio mal al eliminar la categoria.");
  }
}
