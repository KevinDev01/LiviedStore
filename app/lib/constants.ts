import { ProductFields } from "./types";
const initialProductValues: ProductFields = {
  name: "",
  amount: 0,
  price: 0,
  porcentage: 0,
  sku: 0,
  categoryId: "",
  subCategoryId: "",
  exclusive: false,
  discount: false,
  description: "",
  customFeatures: [],
  featuresByCategory: {},
  finalDate: undefined,
  image: "",
  image2: "",
  image3: "",
  image4: "",
  promoId: "",
};

export { initialProductValues };
