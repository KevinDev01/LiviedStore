import { Form, Link } from "@remix-run/react";
import { User } from "~/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const Navbar = ({ data }: { data: User | null }) => {
  return (
    <nav className="py-5 flex items-center">
      <div className="w-48 h-16 overflow-hidden flex justify-center items-center">
        <img className="" src="/resources/LIV.svg" alt="Livied" />
      </div>
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
          <Sheet>
            <SheetTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-7 h-7">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Tu Carrito</SheetTitle>
                <SheetDescription>
                  Ups! aun no tienes productos agregados.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {data ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                  stroke="currentColor"
                  className="w-7 h-7">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 space-y-2">
                <DropdownMenuLabel>
                  <p>Mi cuenta</p>
                  <p className="font-normal">
                    Hola! {data.name} {data.lastname}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <div className="h-10 w-full px-3 flex items-center bg-red-600 hover:bg-red-700 rounded-md">
                    <Form method="post" action="/logout">
                      <button type="submit" className="text-white">
                        Cerrar session
                      </button>
                    </Form>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="text-md bg-sky-200 text-sky-600 p-1 h-10 w-20 flex justify-center items-center rounded-md active:ring-2 active:ring-sky-200 hover:bg-sky-300 hover:text-sky-900 transition ease-out">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
