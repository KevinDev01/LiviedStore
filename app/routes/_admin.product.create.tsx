import type {
  ActionFunctionArgs,
  MetaFunction,
  UploadHandler,
} from "@remix-run/node";
import {
  json,
  redirect,
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
import { useEffect, useState } from "react";
import { getCategories, getCategory } from "~/database/hooks/category.server";
import { uploadImage } from "~/services/cloudinary.server";
import { validateProduct } from "~/services/product.server";
import { createProduct } from "~/database/hooks/product.server";
import {
  ProductFields,
  CategoryCustomProduct,
  PromoCustomProduct,
} from "~/lib/types";
import { cn } from "~/lib/utils";
import { initialProductValues } from "~/lib/constants";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import Alert from "~/components/form/Alert";
import ProductFeatures from "~/components/form/product_features";
import ProductEdit from "~/components/store/product_edit";
import InputCustom from "~/components/form/input";
import TextArea from "~/components/form/textarea";
import Spinner from "~/components/form/spinner";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Nuevo producto" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    let alerts = {};
    const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
      async ({ filename, data, contentType }) => {
        if (filename === undefined) return;
        if (contentType?.includes("image") === false) return "";
        const uploadedImage = await uploadImage(data);
        return uploadedImage.secure_url;
      },
      unstable_createMemoryUploadHandler()
    );

    const body = await unstable_parseMultipartFormData(request, uploadHandler);
    const product = {
      name: body.get("name") as string,
      sku: parseInt(body.get("sku") as string),
      amount: parseInt(body.get("amount") as string),
      price: parseFloat(body.get("price") as string),
      description: body.get("description") as string,
      categoryId: body.get("categoryId") as string,
      subCategoryId: body.get("subCategoryId") as string,
      image: body.get("image") as string,
      image2: body.get("image2") as string,
      image3: body.get("image3") as string,
      image4: body.get("image4") as string,
    };
    const globalFeatures = {
      custom_features: JSON.parse(
        body.get("custom_features") as string
      ) as string[],
      featuresByCategory: JSON.parse(
        body.get("featuresByCategory") as string
      ) as Record<string, string>,
    };
    const customPromo = {
      discount: body.get("checkbox_discount") as string,
      porcentage: parseInt(body.get("porcentage") as string),
      finalDate: body.get("finalDate") as string,
    };
    const exclusive = body.get("exclusive") as string;
    const promoId = body.get("promoId") as string;
    // validations
    const productAlerts = validateProduct(product);
    if (productAlerts !== null) {
      alerts = productAlerts;
    }
    if (!product.image) {
      alerts = { ...alerts, image: "La imagen es requerida." };
    }
    const category = await getCategory(product.categoryId);
    if (customPromo.discount !== null) {
      if (
        customPromo.porcentage.toString() === "" ||
        customPromo.porcentage > 100
      ) {
        alerts = { ...alerts, porcentage: "El porcentage no es valido." };
      }
      if (customPromo.finalDate === "") {
        alerts = { ...alerts, finalDate: "La fecha final es requerida." };
      }
    }
    if (
      Object.keys(globalFeatures.featuresByCategory).length !==
      category?.features.length
    ) {
      alerts = {
        ...alerts,
        featuresByCategory: "Faltan características por rellenar.",
      };
    }
    if (Object.values(alerts).length > 0) {
      return json(alerts, { status: 400, statusText: "Datos incompletos." });
    }
    const values = {
      product,
      promoId,
      exclusive,
      globalFeatures,
      customPromo,
    } as any;
    const new_product = await createProduct(values);
    return redirect("/panel");
  } catch (error) {
    console.log(error);
    return { error: "Error al crear el producto, la imagen es requerida." };
  }
};

export const loader = async () => {
  const categories = await getCategories();
  if (categories === null) throw new Error("Error al cargar las categorias.");
  return categories.map((category) => ({
    value: category.id,
    name: category.name,
    features: category.features,
    subcategories: category.subCategories.map((subcategory) => ({
      name: subcategory.name,
      value: subcategory.id,
      promotions:
        subcategory.promoId.length > 0 ? subcategory.promoId : undefined,
    })),
  }));
};

export default function ProductCreate() {
  const navigation = useNavigation();
  const actionData = useActionData<Record<string, string>>();
  const categories = useLoaderData<CategoryCustomProduct[]>();
  const [promo, setPromo] = useState<PromoCustomProduct | undefined>(undefined);
  const [product, setProduct] = useState<ProductFields>(initialProductValues);

  useEffect(() => {
    if (product.promoId.length > 0) {
      console.log(product.promoId);
      const promo = categories
        .find((cat) => cat.value === product.categoryId)
        ?.subcategories.find(
          (subcategory) => subcategory?.value === product.subCategoryId
        )
        ?.promotions.find((promo) => promo.id === product.promoId);
      setPromo(promo);
    }
  }, [product.promoId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (value === "") {
      toast.error(`El campo ${name} no puede estar vacío`);
      return;
    }
    switch (type) {
      case "number":
        if (isNaN(parseFloat(value))) {
          toast.error(`Solo se permiten números en el campo ${name}`);
          return;
        }
        if (name === "porcentage" && parseFloat(value) > 100) {
          toast.error("El porcentaje no puede ser mayor a 100%");
          return;
        }
        setProduct({ ...product, [name]: parseFloat(value) });
        break;
      case "text":
        setProduct({ ...product, [name]: value });
        break;
      case "textarea":
        setProduct({ ...product, [name]: value });
        break;
    }
  };

  const handleChangeFeature = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = e.target.value;
    setProduct({
      ...product,
      featuresByCategory: { ...product.featuresByCategory, [name]: value },
    });
  };

  const addCustomFeature = () => {
    const input = document.querySelector("#customFeature") as HTMLInputElement;
    if (!input) return;
    const name = input.value;
    if (name === "") {
      toast.error(
        "El campo de caracteristicas customizadas no puede estar vacío."
      );
      return;
    }
    const newFeature = { id: Date.now(), name };
    setProduct({
      ...product,
      customFeatures: [...product.customFeatures, newFeature],
    });
    toast.success("Característica personalizada agregada.");
    input.value = "";
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file: File | null = e.target.files?.[0] || null;
    if (file) {
      toast.info("Imagen seleccionada.");
      const image = URL.createObjectURL(file);
      setProduct({ ...product, [name]: image });
    }
  };

  const deleteFeature = (id: number) => {
    const newCustomFeatures = product.customFeatures.filter(
      (item) => item.id !== id
    );
    setProduct({ ...product, customFeatures: newCustomFeatures });
    toast.success("La característica personalizada ha sido eliminada.");
  };

  return (
    <>
      <aside className="bg-hero-product w-1/2 pb-10">
        <div className="h-fit sticky top-16 flex justify-center">
          <ProductEdit
            product={product}
            discount={product.discount}
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
            handleChange={(e) => handleChange(e)}
            error={actionData?.name}
            value={product.name}
          />
          <InputCustom
            id="sku"
            type="number"
            label="SKU del producto"
            description="Ingresa el identificador del producto"
            name="sku"
            width="w-full"
            handleChange={(e) => handleChange(e)}
            error={actionData?.sku}
            value={product.sku === 0 ? "" : product.sku.toString()}
          />
          <div className="w-full flex justify-between gap-5">
            <InputCustom
              id="price"
              type="number"
              label="Precio del producto"
              description="Cual es el precio del producto?"
              name="price"
              width="w-1/2"
              handleChange={(e) => handleChange(e)}
              value={product.price === 0 ? "" : product.price.toString()}
              error={actionData?.price}
              pattern="^\d+$"
            />
            <InputCustom
              id="amount"
              type="number"
              label="Productos disponibles"
              description="Cuantas cantidades existen?"
              name="amount"
              width="w-1/2"
              handleChange={(e) => handleChange(e)}
              value={product.amount === 0 ? "" : product.amount.toString()}
              pattern="^\d+$"
              error={actionData?.amount}
            />
          </div>
          <div className="flex gap-5">
            <div className="w-1/2">
              <Select
                name="categoryId"
                onValueChange={(categoryId) =>
                  setProduct({ ...product, categoryId })
                }
              >
                <SelectTrigger className="w-full h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
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
              {actionData?.subCategoryId && (
                <p className="p-1 px-2 bg-red-100 text-red-500 font-medium rounded-md">
                  {actionData?.subCategoryId && "La categoria es requerida"}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <Select
                disabled={product.categoryId ? false : true}
                onValueChange={(subCategoryId) =>
                  setProduct({ ...product, subCategoryId })
                }
                name="subCategoryId"
              >
                <SelectTrigger className="w-full h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                  <SelectValue placeholder="Selecciona la sub categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .find((cat) => cat.value === product.categoryId)
                    ?.subcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory.value}
                        value={subcategory.value}
                      >
                        {subcategory.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="ml-2 text-sm font-medium text-zinc-800">
                Selecciona la Sub Categoria
                <span className="text-red-500 text-xl">*</span>
              </p>
              {actionData?.subCategoryId && (
                <p className="p-1 px-2 bg-red-100 text-red-500 font-medium rounded-md">
                  {actionData?.subCategoryId && "La sub-categoria es requerida"}
                </p>
              )}
            </div>
          </div>
          {categories
            .find((cat) => cat.value === product.categoryId)
            ?.subcategories.find(
              (subcategory) => subcategory?.value === product.subCategoryId
            )?.promotions !== undefined && (
            <>
              <Alert
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
                    {categories
                      .find((cat) => cat.value === product.categoryId)
                      ?.subcategories.find(
                        (subcategory) =>
                          subcategory?.value === product?.subCategoryId
                      )
                      ?.promotions.map((promo) => (
                        <SelectItem key={promo.id} value={promo.id}>
                          {`${
                            promo.name
                          } - Descuento del ${promo.value.toString()}%`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="w-full flex justify-between gap-5">
            <div className="items-center flex space-x-2 w-1/2">
              <Checkbox
                disabled={product.promoId ? true : false}
                id="checkbox_discount"
                name="checkbox_discount"
                onClick={() => {
                  setProduct({ ...product, discount: !product.discount });
                }}
                defaultValue={product.discount.toString()}
              />
              <label
                htmlFor="checkbox_discount"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Definir promoción al producto
              </label>
            </div>
            <div className="flex-1">
              <InputCustom
                id="porcentage"
                type="number"
                label="Descuento del producto"
                description="Asigna un descuento del 0 - 100%"
                name="porcentage"
                disabled={product.discount && !product.promoId ? false : true}
                handleChange={(e) => handleChange(e)}
                value={
                  product.porcentage === 0 ? "" : product.porcentage.toString()
                }
                error={actionData?.porcentage}
                max="100"
              />
            </div>
          </div>
          <div className="space-y-3 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={product.discount && !product.promoId ? false : true}
                  variant={"outline"}
                  className={cn(
                    "w-1/2 h-14 justify-start text-left font-normal",
                    !product.finalDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {product.finalDate ? (
                    format(product.finalDate, "PPP")
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) =>
                    setProduct({
                      ...product,
                      finalDate: addDays(new Date(), parseInt(value)),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Hoy</SelectItem>
                    <SelectItem value="1">Mañana</SelectItem>
                    <SelectItem value="7">En 1 Semana</SelectItem>
                    <SelectItem value="31">En 1 Mes</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={product.finalDate}
                    onSelect={(date) =>
                      setProduct({ ...product, finalDate: date })
                    }
                  />
                </div>
              </PopoverContent>
            </Popover>
            <p
              className={`text-sm font-semibold ml-3 text-zinc-800 ${
                product.discount ? "" : "opacity-50"
              }`}
            >
              Cuando termina la promoción?
              <span className="text-red-500 text-lg">*</span>
            </p>
            {actionData?.finalDate && (
              <p className="block my-2 p-1 px-2 bg-red-100 text-red-500 font-medium rounded-md">
                {actionData?.finalDate}
              </p>
            )}
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
              categories.find((cat) => cat.value === product.categoryId)
                ?.features
            }
            errors={actionData?.featuresByCategory}
            onChange={handleChangeFeature}
          />
          <div className="space-y-20 mt-2">
            <TextArea
              id="description"
              name="description"
              label="Ingresa una breve descripción del producto"
              description="Descripción del producto"
              width="w-full"
              height="h-56"
              handleChange={(e) => handleChange(e)}
              error={actionData?.description}
              value={product.description}
            />
            <div className="space-y-3">
              <InputCustom
                id="customFeature"
                type="text"
                label="Lo que debe saber el consumidor del producto"
                description="Datos del producto"
                name="feature"
                width="w-full"
              />
              <Button
                onClick={() => addCustomFeature()}
                type="button"
                className="h-12 w-28 active:bg-zinc-700 active:ring-2 active:ring-zinc-600"
              >
                Agregar
              </Button>
              <nav className="py-2 space-y-3">
                {product.customFeatures.length > 0 ? (
                  product.customFeatures.map((featureItem) => (
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
                  <Alert
                    message1="!Tu producto no cuenta con datos para el consumidor, agrega
                  algunos¡"
                  />
                )}
              </nav>
            </div>
          </div>
          <hr />
          <h3 className="text-center font-medium">Últimos pasos</h3>
          <div className="space-y-5">
            {actionData?.image && (
              <p className="block my-2 p-1 px-2 bg-red-100 text-red-500 font-medium rounded-md">
                {actionData?.image}
              </p>
            )}
            <label htmlFor="img-field" className="text-md block">
              Subir imagen principal{" "}
              <span className="text-red-500">(requerida)</span>
            </label>
            <Input
              id="img-field"
              name="image"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              onChange={handleChangeImage}
              accept="image/*"
            />
            <label htmlFor="img-field-2" className="text-md block">
              Subir imagen 2 <span className="text-sky-500">(opcional)</span>
            </label>
            <Input
              id="img-field-2"
              name="image2"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              accept="image/*"
              onChange={handleChangeImage}
            />
            {product.image2 && (
              <img
                className="w-56 h-56"
                src={product.image2}
                alt="product image 2"
              />
            )}
            <label htmlFor="picture" className="text-md block">
              Subir imagen 3 <span className="text-sky-500">(opcional)</span>
            </label>
            <Input
              id="img-field"
              name="image3"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              onChange={handleChangeImage}
              accept="image/*"
            />
            {product.image3 && (
              <img
                className="w-56 h-56"
                src={product.image3}
                alt="product image 3"
              />
            )}

            <label htmlFor="picture" className="text-md block">
              Subir imagen 4 <span className="text-sky-500">(opcional)</span>
            </label>
            <Input
              id="img-field"
              name="image4"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              onChange={handleChangeImage}
              accept="image/*"
            />
            {product.image4 && (
              <img
                className="w-56 h-56"
                src={product.image4}
                alt="product image 4"
              />
            )}

            {actionData?.error && (
              <p className="p-1 px-2 bg-red-100 text-red-500 font-medium rounded-md text-center">
                {actionData?.error}
              </p>
            )}
            <div className="flex justify-end">
              {navigation.state === "submitting" ? (
                <Spinner />
              ) : (
                <Button
                  type="submit"
                  className="h-12 bg-blue-600 hover:bg-blue-500"
                >
                  Crear producto
                </Button>
              )}
            </div>
          </div>
          <input
            type="hidden"
            defaultValue={JSON.stringify(product.featuresByCategory)}
            name="featuresByCategory"
          />
          <input
            type="hidden"
            defaultValue={JSON.stringify(product.customFeatures)}
            name="custom_features"
          />
          <input
            type="hidden"
            defaultValue={product.finalDate?.toString()}
            name="finalDate"
          />
        </Form>
      </div>
    </>
  );
}
