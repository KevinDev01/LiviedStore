import { createProductSchema } from "~/schemas/product.schema";
import { filterErrorsZod } from "~/lib/utils";

export function validateProduct(values: Record<string, string | number>) {
  try {
    createProductSchema.parse(values);
    return null;
  } catch (error: any) {
    const result = filterErrorsZod(error.errors);
    return result;
  }
}
