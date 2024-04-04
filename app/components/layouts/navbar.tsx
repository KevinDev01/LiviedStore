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
          <div className="relative group pb-3 pt-2">
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
            <div className="z-10 absolute -right-44 translate-y-3 h-0 w-96 opacity-0 group-hover:opacity-100 group-hover:h-fit group-hover:p-2 overflow-hidden bg-neutral-100 rounded-md shadow-md flex flex-col justify-between transition ease-in">
              <p className="text-center text-neutral-600">
                Aun no tienes productos agregados.
              </p>
              <button className="mx-auto h-12 w-full mt-2 bg-sky-300 rounded-md text-xl text-sky-800 font-semibold">
                Mirar productos
              </button>
            </div>
          </div>
          <div>
            {user ? (
              <p>
                Hola! <span>{user.name}</span>
              </p>
            ) : (
              <Link
                to="/login"
                className="text-md bg-sky-200 text-sky-600 p-1 w-20 text-center rounded-md block">
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
