import { Link, Form } from "@remix-run/react";

const router = [
  {
    id: 1,
    pathname: "/panel/categories/create",
    label: "Crear categoria",
  },
  {
    id: 2,
    pathname: "/product/create",
    label: "Nuevo producto",
  },
  {
    id: 3,
    pathname: "/panel/promos/create",
    label: "Nueva promoción",
  },
];

const AdminAside = () => {
  return (
    <aside className="w-60 py-2 border-r overflow-hidden sticky top-0 h-screen">
      <div className="flex justify-center">
        <Link
          to={"/"}
          className="w-36 h-16 bg-logo bg-cover bg-center bg-no-repeat"></Link>
      </div>
      <h1 className="text-md text-center mb-2">Panel administrador</h1>
      <hr />
      <div className="flex flex-col justify-between h-[85%]">
        <div>
          <p className="font-medium pl-5 mt-2 text-sky-800">Acciones rápidas</p>
          <nav className="w-full space-y-2 px-2 mt-1">
            {router.map((route) => (
              <Link
                key={route.id}
                to={route.pathname}
                className="flex items-center h-10 pl-4 text-md text-white bg-sky-500 hover:bg-sky-600 transition ease-in rounded-md">
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="font-medium text-sm pl-5 mt-2 text-sky-800">Cuenta</p>
          <nav className="w-full space-y-2 p-1">
            <Form action="/logout" method="POST">
              <button className="flex items-center h-10 pl-3 text-md text-white bg-red-600 hover:bg-red-500 transition ease-in rounded-md">
                Cerrar session
              </button>
            </Form>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default AdminAside;
