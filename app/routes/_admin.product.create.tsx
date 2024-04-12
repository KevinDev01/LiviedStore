import { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import ProductBox from "~/components/store/product_box";
import InputCustom from "~/components/form/input";
import TextArea from "~/components/form/textarea";
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

export default function ProductCreate() {
  const fields = [
    { name: "Electronica", value: "1" },
    { name: "Hogar", value: "2" },
    { name: "Vapes", value: "3" },
    { name: "Muebles", value: "4" },
    { name: "Juguetes", value: "5" },
  ];

  return (
    <>
      <aside className="w-1/2 pb-10 h-fit sticky top-16 flex justify-center">
        <ProductBox />
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
          />
          <InputCustom
            id="sku"
            type="text"
            label="SKU del producto"
            description="Ingresa el identificardor del producto"
            name="sku"
            width="w-full"
          />
          <div className="w-full flex justify-between gap-5">
            <InputCustom
              id="price"
              type="number"
              label="Precio del producto"
              description="Cual es el precio del producto?"
              name="price"
              width="w-1/2"
            />
            <InputCustom
              id="amount"
              type="number"
              label="Productos disponibles"
              description="Cuantas cantidades existen?"
              name="amount"
              width="w-1/2"
            />
          </div>
          <div className="w-full flex justify-between gap-5">
            <div className="items-center flex space-x-2 w-1/2">
              <Checkbox id="terms1" />
              <label
                htmlFor="terms1"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Definir promoción al producto
              </label>
            </div>
            <InputCustom
              id="discount"
              type="number"
              label="% Descuento"
              description="Asigna un descuento del 0 - 100%"
              name="discount"
              width="w-1/2"
              disabled={true}
            />
          </div>
          <Select>
            <SelectTrigger className="w-72 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-300 shadow-md">
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
          <hr />
          <h3 className="text-center font-medium">Detalles del producto</h3>
          <TextArea
            id="description"
            name="description"
            label="Ingresa una breve descripción del producto"
            description="Descripción del producto"
            width="w-full"
            height="h-56"
          />
          <div className="pt-8 space-y-3">
            <InputCustom
              id="feature"
              type="text"
              label="Agrega las característica del producto"
              description="características del producto"
              name="feature"
              width="w-full"
            />
            <Button
              type="button"
              className="h-12 active:bg-zinc-700 active:ring-2 active:ring-zinc-600">
              Crear producto
            </Button>

            <ul className="py-2">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-4 h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
                  />
                </svg>
                <p className="flex items-center text-md">
                  !Tu producto no cuenta con características, agrega algunas ¡
                </p>
              </li>
            </ul>
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
