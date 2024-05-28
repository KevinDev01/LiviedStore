import { createProductSchema } from "~/schemas/product.schema";
import { filterErrorsZod } from "~/lib/utils";
import {
  getProductById,
  getRelatedProducts,
} from "~/database/hooks/product.server";

export function validateProduct(values: Record<string, string | number>) {
  try {
    createProductSchema.parse(values);
    return null;
  } catch (error: any) {
    const result = filterErrorsZod(error.errors);
    return result;
  }
}

export async function getProductWithRelations(product_id: string) {
  const product = await getProductById(product_id);
  if (!product) return null;
  const relatedProducts = await getRelatedProducts(product);
  return { product, relatedProducts };
}
