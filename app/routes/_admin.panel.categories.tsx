import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
  Outlet,
  Link,
  useLoaderData,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  deleteCategory,
  getCategories,
} from "~/database/hooks/category.server";
import { formatterDate } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Categorías" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const categoryId = body.get("categoryId");
  await deleteCategory(categoryId as string).catch((err) => {
    return json({ message: err.message });
  });
  return json({ message: "Categoria Eliminada" });
};

export const loader = async () => {
  const categories = await getCategories();
  if (!categories) throw new Error("No se encontraron categorías");
  return categories;
};

export default function Categories() {
  const submit = useSubmit();
  const data = useActionData<typeof action>();
  const categories = useLoaderData<typeof loader>();

  useEffect(() => {
    if (data?.message) {
      toast.success(data.message);
    }
  }, [data]);

  const deleteCategory = async (id: string) => {
    const formData = new FormData();
    formData.append("categoryId", id);
    submit(formData, { method: "post" });
  };

  return (
    <>
      <h2 className="ml-2 mb-2 font-medium text-sky-800">
        Estas viendo las categorías
      </h2>
      <div className="px-2 w-full">
        <table className="w-full overflow-hidden rounded-md space-y-1">
          <thead>
            <tr className="bg-white flex gap-8 items-center justify-between w-full border h-12 px-2 rounded-md">
              <th className="flex justify-start font-normal min-w-[20%] max-w-[20%]">
                ID
              </th>
              <th className="flex justify-start font-normal min-w-[20%] max-w-[20%]">
                Name
              </th>
              <th className="flex justify-start font-normal min-w-[20%] max-w-[20%]">
                SubCategorías
              </th>
              <th className="flex justify-start font-normal min-w-[20%] max-w-[20%]">
                Created
              </th>
              <th className="flex justify-start font-normal min-w-[20%] max-w-[20%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="bg-white flex gap-8 items-center justify-between w-full border py-3 px-2 rounded-md"
              >
                <td className="font-normal min-w-[20%] max-w-[20%] truncate flex items-center">
                  {category.id}
                </td>
                <td className="font-normal min-w-[20%] max-w-[20%] truncate flex items-center">
                  {category.name}
                </td>
                <td className="font-normal min-w-[20%] max-w-[20%] truncate flex items-center">
                  <nav>
                    {category.subCategories.length > 0 ? (
                      category.subCategories.map((subcategory) => (
                        <li key={subcategory.id}>{subcategory.name}</li>
                      ))
                    ) : (
                      <p>Aun no existen</p>
                    )}
                  </nav>
                </td>
                <td className="font-normal min-w-[20%] max-w-[20%] truncate flex items-center">
                  {formatterDate(category.createdAt)}
                </td>
                <td className="font-normal min-w-[20%] max-w-[20%] truncate flex items-center gap-5">
                  <button
                    className="text-red-600"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <Link
                    to={`/panel/categories/update/${category.id}`}
                    className="text-indigo-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </>
  );
}
