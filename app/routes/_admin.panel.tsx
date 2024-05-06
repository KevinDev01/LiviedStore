import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { getUserBySession } from "~/services/user.server";
import AdminAside from "~/components/layouts/admin_aside";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserBySession(request);
  if (user === null) return redirect("/");
  return user;
};

export default function Panel() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex h-fit relative">
      <AdminAside />
      <section className="flex-1 overflow-hidden">
        <div className="h-14 flex justify-between items-center px-5">
          <div className="flex items-center gap-5 h-full text-sky-500">
            <Link to="/inventary">Inventario</Link>
            <Link to="/orders">Pedidos</Link>
            <Link to="/panel/categories">Categorías</Link>
            <Link to="/panel/promos">promociones</Link>
          </div>
          <p>Bienvenido {data?.name}</p>
        </div>
        <hr />
        <div className="flex flex-col bg-stone-100 h-full pt-2 pb-4">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
