import { MetaFunction } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { getPromos } from "~/database/hooks/promo.server";
import { formatterDate, getDays, getDaysToDB } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Promociones" }];
};

export const loader = async () => {
  const promos = await getPromos();
  return promos;
};

export default function adminPromos() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <h2 className="ml-2 mb-2 font-medium text-sky-800">
        Estas viendo las promociones
      </h2>
      <div className="px-2">
        <section className="grid grid-cols-3 mb-3">
          {loaderData?.map((promo) => (
            <Link
              key={promo.id}
              to={"#"}
              className="bg-white h-42 w-72 p-2 border hover:border-sky-500 hover:ring hover:ring-sky-200 rounded-md hover:shadow-lg hover:shadow-sky-500 flex flex-col justify-evenly transition ease-in">
              <h3 className="font-medium truncate">{promo.name}</h3>
              <p className="font-sm text-green-600">{promo.value}% OFF</p>
              <p>Cupon: {promo.cupon ? promo.cupon : "No existe"}</p>
              <p>
                Asignada a:{" "}
                {promo.subcategory.name ? promo.subcategory.name : "No existe"}
              </p>
              <p>Fecha final: {formatterDate(promo.finalDate)}</p>
              <p>Dias restantes: {getDaysToDB(promo.finalDate)}</p>
            </Link>
          ))}
        </section>
        <Outlet />
      </div>
    </>
  );
}
