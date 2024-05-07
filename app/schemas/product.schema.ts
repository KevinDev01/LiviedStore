import { z } from "zod";

//   name: string;
//   amount: number;
//   price: number;
//   porcentage: number;
//   sku: string;
//   categoryId: string;
//   subCategoryId: string;
//   exclusive: boolean;
//   description: string;
//   features: Array<Record<string, string>>;
//   featuresByCategory: Record<string, string | number>;
//   image: string;
//   promoId: string;

export const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(2, { message: "Nombre no valido" }),
  amount: z.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad no es valida",
  }),
  price: z.number({
    required_error: "El precio es requerido",
    invalid_type_error: "El precio no es valido",
  }),
});
