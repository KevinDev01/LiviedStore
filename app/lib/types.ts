export type AuthRedirectOptions = {
  failureRedirect?: string;
  successRedirect?: string;
};

export type ErrorsBox = {
  [key: string]: string;
  [index: number]: string;
};

export type Profile = {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export type ValidationErrors = {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  undefined?: string;
};

// PRODUCT TYPES
export type ProductFields = {
  name: string;
  amount: number;
  price: number;
  porcentage: number;
  sku: number;
  categoryId: string;
  subCategoryId: string;
  exclusive: boolean;
  discount: boolean;
  description: string;
  customFeatures: Array<{ id: number; name: string }>;
  featuresByCategory: Record<string, string>;
  promoId: string;
  finalDate: Date | undefined;
  image: string;
  image2: string;
  image3: string;
  image4: string;
};

export type PromoCustomProduct = {
  id: string;
  name: string;
  value: number;
  finalDate: string;
};

type SubCategory = {
  name: string;
  value: string;
  promotions: PromoCustomProduct[];
};

export type CategoryCustomProduct = {
  name: string;
  value: string;
  features: string[];
  subcategories: SubCategory[];
};
