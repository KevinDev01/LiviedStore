import { Link, Outlet } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import Authenticator from "~/services/auth.server";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return await Authenticator.isAdmin(request, {
//     failureRedirect: "/",
//   });
// };

export default function AdminLayout() {
  return (
    <div className="overflow-hidden h-screen py-2">
      <nav className="w-full h-16 px-5 bg-indigo-400 flex items-center justify-between rounded-md shadow-sm">
        <ul>
          <h1 className="text-lg">Panel Administrador</h1>
        </ul>
        <ul className="flex gap-2">
          <Link
            to={"/panel/tracking"}
            className="w-32 h-12 bg-white flex items-center justify-center rounded-md hover:bg-indigo-100 transition ease-out">
            Ver pedidos
          </Link>
          <Link
            to={"/panel/config"}
            className="w-fit h-12 px-5 bg-white flex items-center justify-center rounded-md hover:bg-indigo-100 transition ease-out">
            Editar publicaciones
          </Link>
          <Link
            to={"/panel/create"}
            className="w-32 h-12 bg-white flex items-center justify-center rounded-md hover:bg-indigo-100 transition ease-out">
            Crear producto
          </Link>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
