import { FC } from "react";
import { Form, Link } from "@remix-run/react";

type User = {
  name: string;
  lastname?: string;
};

interface NavbarProps {
  user: User;
}

const Navbar: FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="py-5 flex">
      <img className="text-5xl w-48 h-12" src="#" alt="Livied" />
      <ul className="w-full flex justify-between">
        <li className="flex-1 mx-20">
          <Form className="relative">
            <input
              placeholder="¿Qué estás buscando hoy?"
              className="w-full h-12 bg-neutral-50 text-xl pl-1 pr-10 rounded-md border border-neutral-600 md:focus:border-blue-400 md:focus:outline-none md:focus:ring-2 md:focus:ring-sky-200 transition ease-out"
            />
            <button className="absolute top-3 right-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-6 h-6 hover:scale-110 transition ease-out">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </Form>
        </li>
        <li className="w-48 flex justify-evenly items-center">
          <div className="relative group pb-3 pt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-7 h-7 cursor-pointer">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <div className="z-10 absolute -right-44 h-0 w-96 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:h-fit group-hover:translate-y-2 group-hover:p-2 overflow-hidden bg-white border rounded-md shadow-lg flex flex-col justify-between transition ease-in">
              <p className="text-center text-neutral-600">
                Aun no tienes productos agregados.
              </p>
              <button className="mx-auto h-12 w-full mt-2 bg-sky-300 rounded-md text-xl text-sky-800 font-medium">
                Mirar productos
              </button>
            </div>
          </div>
          <div></div>
          <div>
            {user ? (
              <div className="relative mt-2">
                <button className="peer/profile w-fit h-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.3}
                    stroke="currentColor"
                    className="w-7 h-7">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </button>
                <div className="bg-white shadow-lg absolute top-10 -left-14 z-10 w-44 h-0 opacity-0 translate-y-10 peer-focus/profile:h-fit peer-focus/profile:py-2 peer-focus/profile:opacity-100 peer-focus/profile:-translate-y-0 peer-focus/profile:border space-y-1 rounded-lg overflow-hidden transition ease-out">
                  <div className="px-2">
                    <p className="font-semibold">Tu cuenta</p>
                    <p className="block truncate w-full text-sm">
                      Hola! {user.name} {user.lastname}
                    </p>
                  </div>
                  <hr className="border border-stone-200" />
                  <div className="p-1">
                    <div className="space-y-2">
                      <Link
                        to={"#"}
                        className="flex items-center w-full h-10 pl-1 hover:bg-neutral-200 transition ease-out text-md rounded-md">
                        Ver perfil
                      </Link>
                      <Link
                        to={"#"}
                        className="flex items-center w-full h-10 pl-1 hover:bg-neutral-200 transition ease-out text-md rounded-md">
                        Tus Compras
                      </Link>
                      <button className="flex items-center w-full h-10 pl-1 hover:bg-red-500 hover:text-white hover:font-semibold transition ease-out text-md rounded-md">
                        Cerrar session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-md bg-sky-200 text-sky-600 p-1 h-10 w-20 flex justify-center items-center rounded-md active:ring-2 active:ring-sky-200 hover:bg-sky-300 hover:text-sky-900 transition ease-out">
                Login
              </Link>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
