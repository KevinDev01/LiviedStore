import type {
  ActionFunctionArgs,
  MetaFunction,
  UploadHandler,
} from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getCategories } from "~/database/hooks/category.server";
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
import { toast } from "sonner";
import { uploadImage } from "~/services/cloudinary.server";

type ProductFields = {
  name: string;
  amount: number;
  price: number;
  porcentage: number;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  exclusive: boolean;
  description: string;
  features: Array<Record<string, string>>;
  featuresByCategory: Record<string, string | number>;
  image: string;
  promoId: string;
};

type Promo = Array<Record<string, string | number | null | Date>>;

type SubCategory = Record<string, string | Promo>;

type Category = Record<string, string | SubCategory[] | string[]>;

const initialValues = {
  name: "",
  amount: 0,
  price: 0,
  porcentage: 0,
  sku: "",
  categoryId: "",
  subCategoryId: "",
  exclusive: false,
  description: "",
  features: [],
  featuresByCategory: {},
  image: "",
  promoId: "",
};

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Nuevo producto" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data, contentType, filename }) => {
      if (name !== "img") {
        return undefined;
      }
      // const uploadedImage = await uploadImage(data);
      // return uploadedImage.secure_url;
      return null;
    },
    createMemoryUploadHandler()
  );

  const body = await parseMultipartFormData(request, uploadHandler);
  const product = {
    name: body.get("name") as string,
    sku: body.get("sku") as string,
    amount: body.get("amount") as string,
    price: body.get("price") as string,
    description: body.get("description") as string,
    promoId: body.get("promoId") as string,
    categoryId: body.get("categoryId") as string,
    subCategoryId: body.get("subCategoryId") as string,
    exclusive: body.get("exclusive") as string,
    image: body.get("img") as string,
  };
  const globalFeatures = {
    custom_features: JSON.parse(body.get("custom_features") as string),
    featuresByCategory: JSON.parse(body.get("featuresByCategory") as string),
    finalDate: body.get("finalDate") as string,
  };
  const customPromo = {
    discount: body.get("checkbox_discount") as string,
    porcentage: body.get("porcentage") as string,
  };
  return null;
};

export const loader = async () => {
  const data = await getCategories();
  const categories = data.map((category) => ({
    value: category.id,
    name: category.name,
    featureFields: category.features,
    subcategories: category.subCategories.map((subcategory) => ({
      name: subcategory.name,
      value: subcategory.id,
      promo: subcategory.promoId,
    })),
  }));
  return categories;
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
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <p className="text-center">
        {message1}
        <br />
        {message2}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    </div>
  );
};

export default function ProductCreate() {
  const loaderData = useLoaderData<typeof loader>();
  const [product, setProduct] = useState<ProductFields>(initialValues);
  const [categorySelected, setCategorySelected] = useState<Category>({});
  const [subCategorySelected, setSubCategorySelected] = useState<SubCategory>(
    {}
  );
  const [promo, setPromo] = useState<
    Record<string, string | number | null | Date>
  >({});
  const [feature, setFeature] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date>();
  const [discount, setDiscount] = useState(false);

  useEffect(() => {
    if (product.categoryId) {
      const categorySelect = loaderData.filter(
        (category) => category.value === product.categoryId
      );
      setCategorySelected(categorySelect[0]);
      setSubCategorySelected({});
      setProduct({ ...product, promoId: "", featuresByCategory: {} });
    }
  }, [product.categoryId]);

  useEffect(() => {
    if (
      product.subCategoryId &&
      Array.isArray(categorySelected.subcategories)
    ) {
      const { subcategories } = categorySelected;
      const subCategoryFound = subcategories.filter((subcategory) => {
        if (typeof subcategory !== "string") {
          return subcategory.value === product.subCategoryId;
        }
      });
      if (typeof subCategoryFound[0] === "string") return;
      setSubCategorySelected(subCategoryFound[0]);
      setProduct({ ...product, promoId: "" });
    }
  }, [product.subCategoryId]);

  useEffect(() => {
    if (product.promoId && Array.isArray(subCategorySelected.promo)) {
      const promo = subCategorySelected.promo.filter(
        (promo) => promo.id === product.promoId
      );
      setPromo(promo[0]);
    }
  }, [product.promoId]);

  const handleSetFeature = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeature({ name: event.target.value });
  };

  const handleSetFeatureInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    setProduct({
      ...product,
      featuresByCategory: { ...product.featuresByCategory, [name]: value },
    });
  };

  const handleSetImage = (event: any) => {
    const imageSelected = event.target.files[0];
    if (imageSelected) {
      const image = URL.createObjectURL(imageSelected);
      setProduct({ ...product, image });
    }
  };

  const addFeature = () => {
    feature.id = Date.now().toString();
    setProduct({ ...product, features: [...product.features, feature] });
    setFeature({});
    const input = document.getElementById("feature") as any;
    if (input) input.value = "";
    toast.success(`Característica agregada correctamente`);
  };

  const deleteFeature = (id: string) => {
    const newFeatures = product.features.filter((item) => item.id !== id);
    setProduct({ ...product, features: newFeatures });
    toast.success(`Característica eliminada`);
  };

  return (
    <>
      <aside className="bg-hero-product w-1/2 pb-10">
        <div className="h-fit sticky top-16 flex justify-center">
          <ProductEdit
            product={product}
            date={date}
            discount={discount}
            promo={promo}
          />
        </div>
      </aside>
      <div className="bg-white w-1/2 pt-5 px-10 py-10">
        <div className="flex justify-between">
          <h2 className="text-2xl text-center font-medium">Nuevo producto</h2>
          <Link
            to={"/panel"}
            className="hover:underline hover:text-red-600 transition ease-in"
          >
            Volver
          </Link>
        </div>
        <hr className="my-5" />
        <h3 className="text-center font-medium">Datos generales</h3>
        <Form
          method="post"
          className="pt-5 space-y-7"
          encType="multipart/form-data"
        >
          <InputCustom
            id="name"
            type="text"
            label="Nombre del producto"
            description="Ingresa el nombre del producto"
            name="name"
            width="w-full"
            handleChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            value={product.name}
          />
          <InputCustom
            id="sku"
            type="text"
            label="SKU del producto"
            description="Ingresa el identificador del producto"
            name="sku"
            width="w-full"
            handleChange={(e) =>
              setProduct({ ...product, sku: e.target.value })
            }
            value={product.sku}
          />
          <div className="w-full flex justify-between gap-5">
            <InputCustom
              id="price"
              type="number"
              label="Precio del producto"
              description="Cual es el precio del producto?"
              name="price"
              width="w-1/2"
              handleChange={(e: any) => {
                if (
                  !isNaN(e.target.value) ||
                  e.target.value.toString() === ""
                ) {
                  setProduct({ ...product, price: parseFloat(e.target.value) });
                }
              }}
              value={product.price === 0 ? "" : product.price.toString()}
              pattern="^\d+$"
            />
            <InputCustom
              id="amount"
              type="number"
              label="Productos disponibles"
              description="Cuantas cantidades existen?"
              name="amount"
              width="w-1/2"
              handleChange={(e: any) => {
                if (!isNaN(e.target.value) || e.target.value.toString() === "")
                  setProduct({ ...product, amount: parseInt(e.target.value) });
                return;
              }}
              value={product.amount === 0 ? "" : product.amount.toString()}
              pattern="^\d+$"
            />
          </div>
          <div className="w-full flex justify-between gap-5">
            {/* select category */}
            <div>
              <Select
                name="categoryId"
                onValueChange={(categoryId) =>
                  setProduct({ ...product, categoryId })
                }
              >
                <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {loaderData.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="ml-2 text-sm font-medium text-zinc-800">
                Selecciona una categoria
                <span className="text-red-500 text-xl">*</span>
              </p>
            </div>
            {/* sub categories */}
            <div>
              <Select
                disabled={
                  Array.isArray(categorySelected.subcategories) &&
                  categorySelected.subcategories.length > 0
                    ? false
                    : true
                }
                onValueChange={(subCategoryId) =>
                  setProduct({ ...product, subCategoryId })
                }
                name="subCategoryId"
              >
                <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                  <SelectValue placeholder="Selecciona la sub categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(categorySelected.subcategories)
                    ? categorySelected.subcategories.map((subcategory) =>
                        typeof subcategory === "string" ? null : (
                          <SelectItem
                            key={
                              typeof subcategory.value === "string"
                                ? subcategory.value
                                : null
                            }
                            value={
                              typeof subcategory.value === "string"
                                ? subcategory.value
                                : ""
                            }
                          >
                            {typeof subcategory.name === "string"
                              ? subcategory.name
                              : null}
                          </SelectItem>
                        )
                      )
                    : null}
                </SelectContent>
              </Select>
              <p className="ml-2 text-sm font-medium text-zinc-800">
                Selecciona la Sub Categoria
                <span className="text-red-500 text-xl">*</span>
              </p>
            </div>
          </div>
          {Array.isArray(subCategorySelected.promo) &&
          subCategorySelected?.promo.length > 0 ? (
            <>
              <AlertInfo
                message1="Se han encontrado promociones existentes para esta Sub-Categoría."
                message2="¿Deseas aplicar alguna de ellas?"
              />
              <div className="flex gap-5">
                <Select
                  name="promoId"
                  onValueChange={(promoId) =>
                    setProduct({ ...product, promoId })
                  }
                >
                  <SelectTrigger className="w-full h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200 transition ease-in">
                    <SelectValue placeholder="Selecciona una promoción - (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(subCategorySelected.promo)
                      ? subCategorySelected.promo.map((promo) => (
                          <SelectItem
                            key={typeof promo.id === "string" ? promo.id : null}
                            value={typeof promo.id === "string" ? promo.id : ""}
                          >
                            {`${
                              typeof promo.name === "string" ? promo.name : null
                            } - Descuento del ${
                              typeof promo.value === "number"
                                ? promo.value
                                : null
                            }%`}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
                {/* {product.promoId && (
                  <Button
                    className="h-14 w-32 bg-red-500 text-white text-lg font-medium hover:bg-red-600 active:ring active:ring-red-500 transition ease-in"
                    type="button"
                    onClick={() => {
                      setProduct({ ...product, promoId: "" });
                    }}
                  >
                    Eliminar
                  </Button>
                )} */}
              </div>
            </>
          ) : null}
          <div className="w-full flex justify-between gap-5">
            {/* checkbox promo */}
            <div className="items-center flex space-x-2 w-1/2">
              <Checkbox
                disabled={product.promoId ? true : false}
                id="checkbox_discount"
                name="checkbox_discount"
                onClick={() => {
                  setDiscount(!discount);
                }}
                defaultValue={discount.toString()}
              />
              <label
                htmlFor="checkbox_discount"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Definir promoción al producto
              </label>
            </div>
            {/* set porcentage */}
            <div className="flex-1">
              <InputCustom
                id="porcentage"
                type="number"
                label="Descuento del producto"
                description="Asigna un descuento del 0 - 100%"
                name="porcentage"
                disabled={discount && !product.promoId ? false : true}
                handleChange={(e: any) => {
                  if (!isNaN(e.target.value) || e.target.value === "") {
                    const numericValue = parseInt(e.target.value, 10);
                    if (numericValue <= 100) {
                      setProduct({ ...product, porcentage: numericValue });
                    }
                  }
                }}
                value={
                  product.porcentage === 0 ? "" : product.porcentage.toString()
                }
                max="100"
              />
            </div>
          </div>
          <div className="space-y-3 w-full">
            <DatePickerWithPresets
              disabled={discount && !product.promoId ? false : true}
              date={date}
              setDate={setDate}
            />
            <p
              className={`text-sm font-semibold ml-3 text-zinc-800 ${
                discount ? "" : "opacity-50"
              }`}
            >
              Cuando termina la promoción?
              <span className="text-red-500 text-lg">*</span>
            </p>
          </div>
          <div className="flex justify-between flex-row">
            <div className="items-center flex space-x-2 w-1/2 pl-2">
              <Checkbox
                id="exclusive"
                name="exclusive"
                onClick={() => {
                  setProduct({ ...product, exclusive: !product.exclusive });
                }}
                defaultValue={product.exclusive.toString()}
              />
              <label
                htmlFor="exclusive"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Producto exclusivo online?
              </label>
            </div>
          </div>
          <hr />
          <h3 className="text-center font-medium">Detalles del producto</h3>
          <ProductFeatures
            features={
              Array.isArray(categorySelected.featureFields)
                ? categorySelected.featureFields
                : []
            }
            handleChangeFeatureInput={handleSetFeatureInput}
          />
          <TextArea
            id="description"
            name="description"
            label="Ingresa una breve descripción del producto"
            description="Descripción del producto"
            width="w-full"
            height="h-56"
            handleChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            value={product.description}
          />
          <div className="pt-8 space-y-3">
            <InputCustom
              id="feature"
              type="text"
              label="Lo que debe saber el consumidor del producto"
              description="Datos del producto"
              name="feature"
              width="w-full"
              handleChange={handleSetFeature}
              value={feature.name}
            />
            <Button
              onClick={() => addFeature()}
              type="button"
              className="h-12 w-28 active:bg-zinc-700 active:ring-2 active:ring-zinc-600"
            >
              Agregar
            </Button>
            <nav className="py-2 space-y-3">
              {product.features.length > 0 ? (
                product.features.map((featureItem) => (
                  <li
                    key={featureItem.id}
                    className="flex gap-2 items-center justify-between px-2 py-1 rounded-md border-b"
                  >
                    {featureItem.name}
                    <svg
                      onClick={() => deleteFeature(featureItem.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-red-500 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </li>
                ))
              ) : (
                <AlertInfo
                  message1="!Tu producto no cuenta con datos para el consumidor, agrega
                  algunos¡"
                />
              )}
            </nav>
          </div>
          <hr />
          <h3 className="text-center font-medium">Últimos pasos</h3>
          <div className="space-y-5">
            <label htmlFor="picture" className="text-md">
              Subir imagen
            </label>
            <Input
              id="img-field"
              name="img"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              onChange={handleSetImage}
              accept="image/*"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="h-12 bg-blue-600 hover:bg-blue-500"
              >
                Crear producto
              </Button>
            </div>
          </div>
          <input
            type="hidden"
            defaultValue={JSON.stringify(product.featuresByCategory)}
            name="featuresByCategory"
          />
          <input
            type="hidden"
            defaultValue={JSON.stringify(product.features)}
            name="custom_features"
          />
          <input
            type="hidden"
            defaultValue={date?.toDateString()}
            name="finalDate"
          />
        </Form>
      </div>
    </>
  );
}
