import db from "../db.server";
import { formatterDateFromString } from "~/lib/utils";

export async function createPromo(
  name: string,
  porcentage: number,
  cupon: string,
  subCategoryId: string,
  finalDate: string
) {
  try {
    const newPromo = await db.promo.create({
      data: {
        name,
        value: porcentage,
        cupon,
        subCategoryId,
        finalDate: formatterDateFromString(finalDate),
      },
    });
    return newPromo;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getPromos() {
  try {
    const promos = await db.promo.findMany({
      include: {
        subcategory: true,
      },
    });
    return promos;
  } catch (error) {
    console.log(error);
    return null;
  }
}
