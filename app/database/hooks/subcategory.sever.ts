import { json } from "@remix-run/node";
import db from "../db.server";

export async function createSubcategories(fields: any) {
  const newFields = fields.filter((item: any) => item.new === true);
  const data = fields.map((item: any) => ({
    name: item.name,
    categoryId: item.categoryId as string,
  }));
  await db.subCategory.createMany({
    data,
  });
}

export async function getSubCategoryAndDelete(id: string) {
  try {
    const data = await db.subCategory.delete({
      where: {
        id,
      },
    });
    return json({ message: "SubCategoria eliminada" }, { status: 200 });
  } catch (error) {
    // console.log("error", error);
    return error;
  }
}
