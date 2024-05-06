import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
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
import { loader, ProductFields } from "./_admin.product.create";

export default function ProductCreate() {
  const loaderData = useLoaderData<typeof loader>();
  const initialProductState = {
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
  const [product, setProduct] = useState<ProductFields>(initialProductState);
  const [subCategories, setSubCategories] = useState<
    Array<Record<string, string>>
  >([]);
  const [feature, setFeature] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<Record<string, string>[]>([]);
  const [categoryFound, setCategoryFound] = useState<any>([]);
  const [fieldsFeatures, setFieldsFeatures] = useState<any>({});
  const [date, setDate] = useState<Date>();
  const [promoType, setPromoType] = useState("0");
  const [discount, setDiscount] = useState(false);

  useEffect(() => {
    if (categoriesData && product.categoryId) {
      const categoryFoundByFilter = categoriesData.filter(
        (categoryItem) => categoryItem.id === product.categoryId
      );
      setCategoryFound(categoryFoundByFilter[0]);
      const subCategoryFields = categoryFoundByFilter.map((categoryItem) => {
        return categoryItem.subCategories.map((subCategory) => ({
          name: subCategory.name,
          value: subCategory.id,
        }));
      });
      setSubCategories(subCategoryFields[0]);
    }
  }, [product.categoryId, categoriesData]);

  const handleSetFeature = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeature({ name: event.target.value });
  };

  const handleSetFeatureInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    setFieldsFeatures({
      ...fieldsFeatures,
      [name]: value,
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
    setFeatures([...features, feature]);
    setFeature({});
    const input = document.getElementById("feature") as any;
    if (input) input.value = "";
    toast.success(`Característica agregada correctamente`);
  };

  const deleteFeature = (id: string) => {
    const newFeatures = features.filter((x) => x.id !== id);
    setFeatures(newFeatures);
    toast.success(`Característica eliminada`);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("sku", product.sku);
    formData.append("amount", product.amount.toString());
    formData.append("price", product.price.toString());
    formData.append("porcentage", product.porcentage.toString());
    formData.append("categoryId", product.categoryId);
    formData.append("subCategoryId", product.subCategoryId);
    formData.append("exclusive", product.exclusive.toString());
    formData.append("description", product.description);
    formData.append("image", product.image);
  };

  return (
    <>
      <aside className="bg-hero-product w-1/2 pb-10">
        <div className="h-fit sticky top-16 flex justify-center">
          <ProductEdit product={product} date={date} discount={discount} />
        </div>
      </aside>
      <div className="bg-white w-1/2 pt-5 px-10 py-10">
        <div className="flex justify-between">
          <h2 className="text-2xl text-center font-medium">Nuevo producto</h2>
          <Link
            to={"/panel"}
            className="hover:underline hover:text-red-600 transition ease-in">
            Volver
          </Link>
        </div>
        <hr className="my-5" />
        <h3 className="text-center font-medium">Datos generales</h3>
        <Form
          method="post"
          className="pt-5 space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
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
            <div className="items-center flex space-x-2 w-1/2">
              <Checkbox
                id="checkbox_discount"
                name="checkbox_discount"
                onClick={() => {
                  setDiscount(!discount);
                }}
              />
              <label
                htmlFor="checkbox_discount"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Definir promoción al producto
              </label>
            </div>
            <Select
              onValueChange={(promoId) => setPromoType(promoId)}
              disabled={!discount}>
              <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                <SelectValue placeholder="Como asignaras la promoción?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">A una promo existente</SelectItem>
                <SelectItem value="2">Crear una para el producto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex gap-5">
            <Select
              onValueChange={(promoId) => setPromoType(promoId)}
              disabled={discount && promoType === "1" ? false : true}>
              <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                <SelectValue placeholder="Asignar promoción existente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">A una promo existente</SelectItem>
                <SelectItem value="2">Crear una para el producto</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <InputCustom
                id="discount"
                type="number"
                label="Descuento del producto"
                description="Asigna un descuento del 0 - 100%"
                name="discount"
                disabled={discount && promoType === "2" ? false : true}
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
          <div className="flex justify-between flex-row-reverse">
            <Select
              onValueChange={(categoryId) =>
                setProduct({ ...product, categoryId })
              }>
              <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-3">
              <DatePickerWithPresets
                disabled={discount && promoType === "2" ? false : true}
                date={date}
                setDate={setDate}
              />
              <p
                className={`text-sm font-semibold ${
                  discount && promoType === "2" ? "" : "opacity-50"
                }`}>
                Cuando termina la promoción?
                <span className="text-red-500">*</span>
              </p>
            </div>
          </div>
          <div className="flex justify-between flex-row">
            <Select
              disabled={subCategories.length > 0 ? false : true}
              onValueChange={(subCategoryId) =>
                setProduct({ ...product, subCategoryId })
              }>
              <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
                <SelectValue placeholder="Selecciona una subCategoria" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="items-center flex space-x-2 w-1/2 pl-2">
              <Checkbox
                id="exclusive"
                onClick={() => {
                  setProduct({ ...product, exclusive: !product.exclusive });
                }}
              />
              <label
                htmlFor="exclusive"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Producto exclusivo online?
              </label>
            </div>
          </div>
          <hr />
          <h3 className="text-center font-medium">Detalles del producto</h3>
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
              className="h-12 w-28 active:bg-zinc-700 active:ring-2 active:ring-zinc-600">
              Agregar
            </Button>
            <nav className="py-2 space-y-3">
              {features.length > 0 ? (
                features.map((featureItem) => (
                  <li
                    key={featureItem.id}
                    className="flex gap-2 items-center justify-between px-2 py-1 rounded-md border-b">
                    {featureItem.name}
                    <svg
                      onClick={() => deleteFeature(featureItem.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-red-500 cursor-pointer">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </li>
                ))
              ) : (
                <li className="h-12 flex items-center justify-evenly gap-2 p-1 bg-amber-400 rounded-sm">
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
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  <p className="flex items-center text-md">
                    !Tu producto no cuenta con datos para el consumidor, agrega
                    algunas¡
                  </p>
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
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </li>
              )}
            </nav>
          </div>
          <hr />
          <h3 className="text-center font-medium">Últimos pasos</h3>
          <ProductFeatures
            features={categoryFound.features}
            handleChangeFeatureInput={handleSetFeatureInput}
          />
          <div className="space-y-5">
            <label htmlFor="picture" className="text-md">
              Subir imagen
            </label>
            <Input
              id="picture"
              name="picture"
              type="file"
              className="hover:cursor-pointer h-14 pt-4"
              onChange={handleSetImage}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="h-12 bg-blue-600 hover:bg-blue-500">
                Crear producto
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
