import { Outlet, Link, useLocation } from "@remix-run/react";
import Footer from "~/components/layouts/footer";

const AuthLayout = () => {
  const location = useLocation();
  return (
    <>
      <div
        className={`${
          location.pathname === "/register" ? "h-fit" : "h-screen"
        } flex relative`}>
        <nav className="w-full absolute top-0 list-none flex py-2">
          <ul className="w-1/2"></ul>
          <ul className="w-1/2 flex justify-between px-3">
            <li>
              <Link
                to={"/"}
                className="flex justify-center items-center w-24 h-8 bg-red-200 text-red-800 rounded-md">
                Volver
              </Link>
            </li>
            <li>
              <p>¡Grandes descuentos, pequeños precios, solo para ti!</p>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
