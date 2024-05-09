import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(2, { message: "Nombre no valido." }),
  sku: z
    .number({
      required_error: "El sku es requerido.",
      invalid_type_error: "Sku no valido.",
    })
    .gte(8, { message: "Sku no valido." })
    .int({ message: "Sku no valido." })
    .nonnegative({ message: "El sku no puede ser negativo." }),
  amount: z
    .number({
      required_error: "La cantidad es requerida.",
      invalid_type_error: "Cantidad no valida.",
    })
    .int()
    .nonnegative({ message: "La cantidad no puede ser negativa." }),
  price: z
    .number({
      required_error: "El precio es requerido.",
      invalid_type_error: "Precio no valido.",
    })
    .nonnegative({ message: "El precio no puede ser negativo." }),
  categoryId: z.string({ required_error: "La categoria es requerida." }),
  subCategoryId: z.string({ required_error: "La sub-categoria es requerida." }),
  description: z
    .string({ required_error: "La descripción es requerida." })
    .min(80, { message: "La descripción debe ser mayor a 80 caracteres." }),
  image: z.string({ required_error: "La imagen es requerida" }),
});
