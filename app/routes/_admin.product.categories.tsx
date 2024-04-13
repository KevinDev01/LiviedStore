import { Link, Outlet } from "@remix-run/react";

export default function Categories() {
  const fields = [
    { name: "Electronica", value: "1" },
    { name: "Hogar", value: "2" },
    { name: "Vapes", value: "3" },
    { name: "Muebles", value: "4" },
    { name: "Juguetes", value: "5" },
  ];

  return (
    <>
      <aside className="w-60 py-2 border-r min-h-screen max-h-screen overflow-hidden">
        <div className="flex justify-center">
          <div className="w-32 h-16 overflow-hidden flex justify-center items-center">
            <img src="/resources/LIV.svg" alt="livied logo" />
          </div>
        </div>
        <h1 className="text-md text-center mb-2">Panel administrador</h1>
        <hr />
        <div className="flex flex-col justify-between h-[85%]">
          <div>
            <p className="font-normal text-sm pl-5 mt-2 text-sky-800">
              Acciones
            </p>
            <nav className="w-full space-y-2 p-1">
              <Link
                to={"/create"}
                className="block pl-4 py-2 text-md text-white bg-sky-400 hover:bg-sky-600 transition ease-in rounded-md">
                Crear categoría
              </Link>
            </nav>
          </div>
          <div>
            <p className="font-medium text-sm pl-5 mt-2 text-sky-800">Cuenta</p>
            <nav className="w-full space-y-2 p-1">
              <Link
                to={"/create"}
                className="block pl-4 py-2 text-md text-white bg-red-400 hover:bg-red-600 transition ease-in rounded-md">
                Cerrar session
              </Link>
            </nav>
          </div>
        </div>
      </aside>
      <section className="flex-1 h-screen overflow-hidden">
        <div className="flex items-center gap-5 h-14 px-5 text-sky-500">
          <Link to="/inventary">Inventario</Link>
          <Link to="/orders">Pedidos</Link>
          <Link to="/orders">Categorías</Link>
        </div>
        <hr />
        <div className="flex flex-col bg-stone-100 h-full pt-2">
          <h2 className="ml-2 mb-2 font-medium text-sky-800">
            Estas viendo las categorías
          </h2>
          <div className="px-2 w-full">
            <table className="w-full overflow-hidden rounded-md space-y-1">
              <tr className="bg-white flex items-center justify-between w-full border h-12 px-2 rounded-md">
                <th className="flex justify-start font-normal min-w-[25%] max-w-[25%]">
                  ID
                </th>
                <th className="flex justify-start font-normal min-w-[25%] max-w-[25%]">
                  Name
                </th>
                <th className="flex justify-start font-normal min-w-[25%] max-w-[25%]">
                  Created
                </th>
                <th className="flex justify-start font-normal min-w-[25%] max-w-[25%]">
                  Actions
                </th>
              </tr>
              <tr className="bg-white flex items-center justify-between w-full border h-12 px-2 rounded-md">
                <td className="font-normal min-w-[25%] max-w-[25%] truncate">
                  0101010101010101010010101010010101010101010010101
                </td>
                <td className="font-normal min-w-[25%] max-w-[25%] truncate">
                  Categoria
                </td>
                <td className="font-normal min-w-[25%] max-w-[25%] truncate">
                  01/20/2023
                </td>
                <td className="font-normal min-w-[25%] max-w-[25%] truncate">
                  Delete
                </td>
              </tr>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
