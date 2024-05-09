import db from "../db.server";
import { formatterDateFromString } from "~/lib/utils";

type GlobalFeatures = {
  custom_features: Record<string, string>[];
  featuresByCategory: Record<string, string>;
};

type Values = {
  product: Record<string, string>;
  promoId: string;
  exclusive: string;
  globalFeatures: GlobalFeatures;
  customPromo: Record<string, string>;
};

export async function createProduct({
  product,
  promoId,
  exclusive,
  globalFeatures,
  customPromo,
}: Values) {
  const {
    name,
    sku,
    amount,
    price,
    description,
    categoryId,
    subCategoryId,
    image,
  } = product;
  const { discount, porcentage, finalDate } = customPromo;
  const { custom_features, featuresByCategory } = globalFeatures;
  try {
    const product = await db.product.create({
      data: {
        name,
        sku: parseInt(sku),
        price: parseFloat(price),
        amount: parseInt(amount),
        description,
        img: image,
        categoryId,
        subCategoryId,
        discount: discount === null ? false : true,
        porcentage: parseInt(porcentage),
        finalDate: formatterDateFromString(finalDate),
        exclusive: exclusive === null ? false : true,
        featuresByCategory,
        custom_features: custom_features.map((feature) => ({
          [feature.name]: feature.name,
        })),
      },
    });
    return product;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getProducts() {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.log(error);
    return error;
  }
}
