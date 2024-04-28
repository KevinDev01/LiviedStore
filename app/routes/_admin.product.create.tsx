import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getCategories } from "~/database/hooks/category.server";

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

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Nuevo producto" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const categories = await getCategories();
  return categories;
};

export default function ProductCreate() {
  const loaderData = useLoaderData<typeof loader>();
  const fields = loaderData.map((category) => ({
    name: category.name,
    value: category.id,
  }));
  const regexOnlyNumbers = /^\d+$/;
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState("");
  const [discount, setDiscount] = useState(false);
  const [price, setPrice] = useState("");
  const [porcentage, setPorcentage] = useState("");
  const [sku, setSku] = useState("");
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState<
    Array<Record<string, string>>
  >([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    if (loaderData && category) {
      const subCategoryFilter = loaderData.filter(
        (categoryItem) => categoryItem.id === category
      );
      const subCategoryFields = subCategoryFilter.map((categoryItem) => {
        return categoryItem.subCategories.map((subCategory) => ({
          name: subCategory.name,
          value: subCategory.id,
        }));
      });
      setSubCategories(subCategoryFields[0]);
    }
  }, [category, loaderData]);

  const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSetPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      regexOnlyNumbers.test(event.target.value) ||
      event.target.value === ""
    ) {
      setPrice(event.target.value);
    }
  };

  const handleSetPorcentage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (regexOnlyNumbers.test(inputValue) || inputValue === "") {
      const numericValue = parseInt(inputValue, 10);
      if (numericValue <= 100) {
        setPorcentage(numericValue.toString());
      }
    }
  };

  const handleSetAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      regexOnlyNumbers.test(event.target.value) ||
      event.target.value === ""
    ) {
      setAmount(event.target.value);
    }
  };

  const handleSetFeature = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeature({ name: event.target.value });
  };

  const handleSetImage = (event: any) => {
    const imageSelected = event.target.files[0];
    if (imageSelected) {
      const urlImage = URL.createObjectURL(imageSelected);
      setImage(urlImage);
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

  return (
    <>
      <aside className="bg-hero-product w-1/2 pb-10">
        <div className="h-fit sticky top-16 flex justify-center">
          <ProductEdit
            name={name}
            amount={amount}
            discount={discount}
            price={price}
            image={image}
            porcentage={porcentage}
            date={date}
            exclusive={exclusive}
            description={description}
          />
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
        <Form method="post" className="pt-5 space-y-7">
          <InputCustom
            id="name"
            type="text"
            label="Nombre del producto"
            description="Ingresa el nombre del producto"
            name="name"
            width="w-full"
            handleChange={handleSetName}
            value={name}
          />
          <InputCustom
            id="sku"
            type="text"
            label="SKU del producto"
            description="Ingresa el identificador del producto"
            name="sku"
            width="w-full"
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSku(event?.target.value)
            }
            value={sku}
          />
          <div className="w-full flex justify-between gap-5">
            <InputCustom
              id="price"
              type="number"
              label="Precio del producto"
              description="Cual es el precio del producto?"
              name="price"
              width="w-1/2"
              handleChange={handleSetPrice}
              value={price}
              pattern="^\d+$"
            />
            <InputCustom
              id="amount"
              type="number"
              label="Productos disponibles"
              description="Cuantas cantidades existen?"
              name="amount"
              width="w-1/2"
              handleChange={handleSetAmount}
              value={amount}
              pattern="^\d+$"
            />
          </div>
          <div className="w-full flex justify-between gap-5">
            <div className="items-center flex space-x-2 w-1/2">
              <Checkbox
                id="terms1"
                onClick={() => {
                  setDiscount(!discount);
                }}
              />
              <label
                htmlFor="terms1"
                className="text-md font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Definir promoción al producto
              </label>
            </div>
            <InputCustom
              id="discount"
              type="number"
              label="Descuento del producto"
              description="Asigna un descuento del 0 - 100%"
              name="discount"
              width="w-1/2"
              disabled={!discount}
              handleChange={handleSetPorcentage}
              value={porcentage}
              max="100"
            />
          </div>
          <div className="flex justify-between flex-row-reverse">
            <Select onValueChange={(categoryId) => setCategory(categoryId)}>
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
                disabled={!discount}
                date={date}
                setDate={setDate}
              />
              <p
                className={`text-sm font-semibold ${
                  !discount && "opacity-50"
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
                setSubCategoryId(subCategoryId)
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
                  setExclusive(!exclusive);
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
            handleChange={(e) => setDescription(e.target.value)}
            value={description}
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
              className="h-12 active:bg-zinc-700 active:ring-2 active:ring-zinc-600">
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
