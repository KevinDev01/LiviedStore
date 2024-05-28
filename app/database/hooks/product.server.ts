import { Product } from "@prisma/client";
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
    image2,
    image3,
    image4,
  } = product;
  const { discount, porcentage, finalDate } = customPromo;
  const { custom_features, featuresByCategory } = globalFeatures;
  const newProduct = await db.product
    .create({
      data: {
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
        custom_features,
      },
    })
    .then((product) => {
      console.log(product);
      return product;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return newProduct;
}

export async function getProducts() {
  return await db.product
    .findMany({
      include: {
        promo: {
          select: {
            id: true,
            name: true,
            value: true,
            finalDate: true,
            cupon: true,
          },
        },
      },
    })
    .then((products) => products)
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function getProductById(id: string) {
  return await db.product
    .findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subCategory: {
          select: {
            name: true,
          },
        },
        promo: {
          select: {
            name: true,
            value: true,
            finalDate: true,
            cupon: true,
          },
        },
        questions: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    })
    .then((product) => product)
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function getRelatedProducts(product: Product) {
  const { subCategoryId, price, name } = product;

  const priceRange = 300;
  const lowerPrice = price - priceRange;
  const upperPrice = price + priceRange;

  const relatedProducts = await db.product
    .findMany({
      where: {
        OR: [
          {
            subCategoryId,
            price: {
              gte: lowerPrice,
              lte: upperPrice,
            },
          },
          {
            name: {
              contains: name.split(" ")[0],
              mode: "insensitive",
            },
          },
        ],
        AND: {
          id: {
            not: product.id,
          },
        },
      },
    })
    .then((products) => products)
    .catch((error) => {
      console.log(error);
      return null;
    });

  return relatedProducts;
}
