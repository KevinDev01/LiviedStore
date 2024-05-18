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
  try {
    const {
      name,
      sku,
      amount,
      price,
      description,
      categoryId,
      subCategoryId,
      image,
      image2,
      image3,
      image4,
    } = product;
    const { discount, porcentage, finalDate } = customPromo;
    const { custom_features, featuresByCategory } = globalFeatures;
    const newProduct = await db.product.create({
      data: {
        promoId,
        name,
        sku: parseInt(sku),
        price: parseFloat(price),
        amount: parseInt(amount),
        description,
        image,
        image2,
        image3,
        image4,
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
    return newProduct;
  } catch (error) {
    return error;
  }
}

export async function getProducts() {
  const products = await db.product.findMany({
    include: {
      promo: true,
    },
  });
  if (products.length <= 0) return null;
  return products;
}
