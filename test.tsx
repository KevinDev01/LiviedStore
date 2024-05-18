import type {
  ActionFunctionArgs,
  MetaFunction,
  UploadHandler,
} from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { getCategories, getCategory } from "~/database/hooks/category.server";
import { toast } from "sonner";
import { uploadImage } from "~/services/cloudinary.server";
import { validateProduct } from "~/services/product.server";
import { createProduct } from "~/database/hooks/product.server";
import ProductFeatures from "~/components/form/product_features";
import ProductEdit from "~/components/store/product_edit";
import InputCustom from "~/components/form/input";
import TextArea from "~/components/form/textarea";
import { DatePickerWithPresets } from "~/components/form/DatePickerWithPresets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import Spinner from "~/components/form/spinner";

type ProductFields = {
  name: string;
  amount: number;
  price: number;
  porcentage: number;
  sku: number;
  categoryId: string;
  subCategoryId: string;
  exclusive: boolean;
  description: string;
  features: Array<{ id: string; name: string }>;
  featuresByCategory: Record<string, string>;
  image: string;
  promoId: string;
};

type Promo = Array<Record<string, string | number | null | Date>>;

type SubCategory = {
  name: string;
  value: string;
  promoId: string;
};

type Category = {
  name: string;
  value: string;
  features: Array<string>;
  subcategories: Array<SubCategory>;
};

const initialValues: ProductFields = {
  name: "",
  amount: 0,
  price: 0,
  porcentage: 0,
  sku: 0,
  category_id: "",
  sub_category_id: "",
  exclusive: false,
  description: "",
  features: [],
  features_by_category: {},
  image: "",
  promo_id: "",
};

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Nuevo producto" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    let alerts: Record<string, string> = {};
    const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
      async ({ name, data, contentType, filename }) => {
        if (name !== "img") {
          return undefined;
        }
        const uploadedImage = await uploadImage(data);
        return uploadedImage.secure_url;
      },
      unstable_createMemoryUploadHandler()
    );

    const body = await unstable_parseMultipartFormData(request, uploadHandler);
    const product: ProductFields = {
      name: body.get("name") as string,
      sku: parseInt(body.get("sku") as string),
      amount: parseInt(body.get("amount") as string),
      price: parseFloat(body.get("price") as string),
      description: body.get("description") as string,
      categoryId: body.get("categoryId") as string,
      subCategoryId: body.get("subCategoryId") as string,
      image: body.get("img") as string,
      features: JSON.parse(body.get("custom_features") as string),
      featuresByCategory: JSON.parse(body.get("featuresByCategory") as string),
    };
    const promoId = body.get("promoId") as string;
    const exclusive = body.get("exclusive") === "on";
    const promoDiscount = body.get("checkbox_discount") === "on";
    const porcentage = promoDiscount
      ? parseInt(body.get("porcentage") as string)
      : 0;
    const finalDate = new Date(body.get("finalDate") as string);

    // Validations
    const productAlerts = validateProduct(product);
    if (productAlerts) {
      alerts = { ...alerts, ...productAlerts };
    }
    if (!product.image) {
      alerts = { ...alerts, image: "La imagen es requerida." };
    }
    const category = await getCategory(product.categoryId);
    if (promoDiscount) {
      if (!porcentage || porcentage > 100) {
        alerts = { ...alerts, porcentage: "El porcentaje no es válido." };
      }
      if (!finalDate) {
        alerts = { ...alerts, finalDate: "La fecha final es requerida." };
      }
    }
    if (
      Object.keys(product.featuresByCategory).length !==
      category?.features.length
    ) {
      alerts = {
        ...alerts,
        featuresByCategory: "Faltan características por rellenar.",
      };
    }
    if (Object.keys(alerts).length > 0) {
      return json(alerts, { status: 400, statusText: "Datos incompletos." });
    }

    const values = {
      product,
      promoId,
      exclusive,
      promoDiscount,
      porcentage,
      finalDate,
    };

    const new_product = await createProduct(values);
    return new_product;
  } catch (error) {
    console.error(error);
    return json(
      { error: "Error al crear el producto, la imagen es requerida." },
      { status: 500 }
    );
  }
};

export const loader = async () => {
  const categories = await getCategories();
  return categories.map((category) => ({
    value: category.id,
    name: category.name,
    features: category.features,
    subcategories: category.subCategories.map((subcategory) => ({
      name: subcategory.name,
      value: subcategory.id,
      promoId: subcategory.promoId,
    })),
  }));
};

const AlertInfo = ({
  message1,
  message2,
}: {
  message1: string;
  message2?: string;
}) => {
  return (
    <div className="mx-auto p-1 bg-yellow-400 rounded-sm flex justify-evenly items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008M12 6v.01"
        />
      </svg>
      <p className="text-sm">{message1}</p>
      {message2 && <p className="text-sm">{message2}</p>}
    </div>
  );
};

export default function NewProduct() {
  const categories = useLoaderData<Category[]>();
  const [alert, setAlert] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductFields>(initialValues);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (submitted && !isSubmitting && !hasError) {
      toast.success("Producto creado correctamente.");
      navigate("/store/products");
    }
  }, [submitted, isSubmitting, hasError, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/admin/store/products/new", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setAlert(result);
        setHasError(true);
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFeatureChange = (id: string, value: string) => {
    setProduct({
      ...product,
      featuresByCategory: { ...product.featuresByCategory, [id]: value },
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <InputCustom
          label="Nombre"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <InputCustom
          label="SKU"
          type="number"
          name="sku"
          value={product.sku.toString()}
          onChange={handleChange}
          required
        />
        <InputCustom
          label="Cantidad"
          type="number"
          name="amount"
          value={product.amount.toString()}
          onChange={handleChange}
          required
        />
        <InputCustom
          label="Precio"
          type="number"
          name="price"
          value={product.price.toString()}
          onChange={handleChange}
          required
        />
        <TextArea
          label="Descripción"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />
        <Select
          label="Categoría"
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          required>
          <SelectTrigger>
            <SelectValue>Categoría</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {product.categoryId && (
          <Select
            label="Subcategoría"
            name="subCategoryId"
            value={product.subCategoryId}
            onChange={handleChange}
            required>
            <SelectTrigger>
              <SelectValue>Subcategoría</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories
                .find((cat) => cat.value === product.categoryId)
                ?.subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.value} value={subcategory.value}>
                    {subcategory.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        <Checkbox
          name="exclusive"
          checked={product.exclusive}
          onChange={() =>
            setProduct({ ...product, exclusive: !product.exclusive })
          }>
          Producto exclusivo
        </Checkbox>
        <ProductFeatures
          features={
            categories.find((cat) => cat.value === product.categoryId)?.features
          }
          featuresByCategory={product.featuresByCategory}
          onChange={handleFeatureChange}
        />
        <InputCustom
          label="Imagen"
          type="file"
          accept="image/*"
          name="img"
          onChange={handleChange}
          required
        />
        <Select
          label="Promoción"
          name="promoId"
          value={product.promoId}
          onChange={handleChange}>
          <SelectTrigger>
            <SelectValue>Promoción</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin promoción</SelectItem>
            {categories
              .find((cat) => cat.value === product.categoryId)
              ?.subcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.promoId}
                  value={subcategory.promoId}>
                  {subcategory.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {product.promoId && (
          <>
            <Checkbox name="checkbox_discount">Aplicar descuento</Checkbox>
            {product.promoId && (
              <>
                <InputCustom
                  label="Porcentaje de descuento"
                  type="number"
                  name="porcentage"
                  value={product.porcentage.toString()}
                  onChange={handleChange}
                  required
                />
                <DatePickerWithPresets
                  label="Fecha final de la promoción"
                  name="finalDate"
                  value={product.finalDate}
                  onChange={(date) =>
                    setProduct({ ...product, finalDate: date })
                  }
                />
              </>
            )}
          </>
        )}
        {hasError && (
          <AlertInfo
            message1="Ha ocurrido un error."
            message2="Inténtalo de nuevo más tarde."
          />
        )}
        {Object.keys(alert).map((key) => (
          <AlertInfo key={key} message1={alert[key]} />
        ))}
        {isSubmitting ? (
          <Spinner />
        ) : (
          <Button type="submit" variant="primary">
            Crear producto
          </Button>
        )}
      </Form>
    </div>
  );
}
