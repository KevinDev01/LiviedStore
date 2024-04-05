import { Outlet } from "@remix-run/react";
import { PiPackageThin } from "react-icons/pi";
import { formatterPrice } from "~/lib/utils";

const products = [
  {
    name: "Vape-Iplay sabor fresas | 2500 puffs",
    price: 250,
    image: "/resources/Vape-iplay",
    cantidad: 3,
  },
  {
    name: "Abanico portatil humificante",
    price: 566,
    image: "/resources/Vape-iplay",
    cantidad: 6,
  },
];

export default function Panel() {
  return (
    <>
      <section className="mt-2 space-y-1">
        <h2>Ventas</h2>
        <div className="border h-60 w-full rounded-md"></div>
      </section>
      <hr className="mt-5" />
      <section className="h-full mt-5 flex justify-between gap-5 overflow-hidden">
        <div className="w-1/2">
          <h2 className="">Inventario</h2>
          <div
            className={`${
              products
                ? "overflow-y-auto space-y-2 pr-1"
                : "flex flex-col items-center justify-center gap-2"
            }   h-full w-full mx-auto mt-2`}>
            {products ? (
              products.map((product) => (
                <div className="w-full h-20 border rounded-md px-5 flex items-center gap-5 ">
                  <div className="overflow-hidden rounded-full w-16 h-16 border p-1">
                    <img
                      src={`${product.image}.webp`}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="truncate font-medium text-md">
                      {product.name}
                    </p>
                    <div className="flex justify-between">
                      <p className="text-sm">
                        Disponibles: <span>{product.cantidad}</span>
                      </p>
                      <p className="text-sm">
                        precio: <span>{formatterPrice(product.price)}</span>
                      </p>
                      <p className="text-sm">
                        Valor total:{" "}
                        <span>
                          {formatterPrice(product.price * product.cantidad)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p className="font-mono text-lg text-stone-800">
                  Aun no existen productos.
                </p>
                <PiPackageThin size={60} strokeWidth={1} />
              </>
            )}
          </div>
        </div>
        <div className="w-1/2 space-y-1">
          <Outlet />
        </div>
      </section>
    </>
  );
}
