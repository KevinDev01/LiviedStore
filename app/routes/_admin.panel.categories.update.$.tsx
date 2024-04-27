import { useEffect, useState } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  useLocation,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { toast } from "sonner";
import { getCategory, updateCategory } from "~/database/hooks/category.server";
import Spinner from "~/components/form/spinner";
import Input from "~/components/form/input";
import { Button } from "~/components/ui/button";
import { getSubCategoryAndDelete } from "~/database/hooks/subcategory.sever";

type SubCategory = Record<string, string | boolean>;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params["*"] as string;
  const category = await getCategory(id);
  if (!category) return redirect("/panel/categories");
  return { category, url: process.env.URL };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const id = params["*"];
  const body = await request.formData();
  switch (request.method) {
    case "DELETE":
      const subCategoryToDelete = body.get("subCategory_id");
      if (subCategoryToDelete) {
        await getSubCategoryAndDelete(subCategoryToDelete.toString());
      }
      return json(
        { message: "SubCategoria eliminada correctamente" },
        { status: 200 }
      );
      break;
    case "PUT":
      const categoryName = body.get("category") as string;
      const subcategories: SubCategory[] = JSON.parse(
        body.get("subcategories") as string
      );
      const newSubCategories = subcategories.filter(
        (subcategory) => subcategory.new === true
      );
      if (newSubCategories) {
        await updateCategory(id as string, categoryName, newSubCategories);
      }
      return json({ message: "Categoria Actualizada" }, { status: 200 });
      break;
    default:
      break;
  }
  return null;
};

export default function Update_categories() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const location = useLocation();
  const {
    category: { id, name, subCategories },
    url,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [subCategory, setSubCategory] = useState<SubCategory>({ name: "" });
  const [subCategoriesData, setSubCategoriesData] = useState<SubCategory[]>([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    setSubCategoriesData(subCategories);
  }, [location.pathname]);

  useEffect(() => {
    if (actionData?.message) {
      toast.success(actionData.message);
    }
  }, [actionData]);

  const handleSetSubCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubCategory({ name: event.target.value });
  };

  const addSubCategories = () => {
    const regex = /^[a-zA-Z\s]+$/;
    const value = Object.values(subCategory)[0] as string;
    if (value.length <= 0 || !regex.test(value)) {
      setAlert("Nombre no valido");
      return;
    }
    if (alert) setAlert("");
    subCategory.id = Date.now().toString();
    subCategory.categoryId = id;
    subCategory.new = true;
    setSubCategoriesData([...subCategoriesData, subCategory]);
    setSubCategory({ name: "" });
    const input = document.getElementById("subcategory") as any;
    if (input) input.value = "";
    toast.info(`La SubCategoria ${subCategory.name} se agrego`);
  };

  const filterSubCategories = (id: string) => {
    const newSubCategoriesData = subCategoriesData.filter(
      (item) => item.id !== id
    );
    setSubCategoriesData(newSubCategoriesData);
  };

  const removeSubCategory = async (subCategory: SubCategory) => {
    if (!subCategory.new) {
      const formData = new FormData();
      formData.append("subCategory_id", subCategory.id.toString());
      submit(formData, { method: "DELETE" });
    }
    filterSubCategories(subCategory.id.toString());
    toast("SubCategoria eliminada correctamente");
  };

  return (
    <div className="px-2 w-full">
      <Form
        method="PUT"
        className="space-y-7 mt-8 w-1/2"
        encType="multipart/form-data"
        action={`/panel/categories/update/${id}`}>
        <p className="mb-6 font-medium text-sky-900">
          Te encuentras en la categoria{" "}
          <span className="text-orange-500 font-semibold">{name}</span>
        </p>
        <Input
          value={name}
          label="Nombre de la categoría"
          id="category"
          name="category"
          type="text"
          description="Nombre de la categoría principal"
          min={3}
          pattern="[A-Za-z\s]+"
          // error={actionData?.message}
        />
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Input
              label="Nueva SubCategoria"
              id="subcategory"
              name="subcategory"
              type="text"
              description="Agrega una nueva SubCategoría"
              min={3}
              pattern="[A-Za-z\s]+"
              error={alert}
              handleChange={handleSetSubCategory}
              value={
                typeof subCategory.name === "string" ? subCategory.name : ""
              }
            />
          </div>
          <button
            onClick={addSubCategories}
            type="button"
            className="w-32 h-14 rounded-lg bg-purple-500 text-white text-xl font-medium hover:bg-purple-600 active:ring-2 active:ring-purple-700 transition ease-in shadow-md">
            Agregar
          </button>
        </div>
        <hr />
        <p className="font-medium text-sky-800">SubCategorías agregadas</p>
        <div>
          <nav>
            <ul className="space-y-3">
              {subCategoriesData.length > 0 ? (
                subCategoriesData.map((item) => (
                  <li
                    key={item.id as string}
                    className="h-12 bg-neutral-200 px-2 py-1 rounded-sm flex justify-between items-center">
                    <p className="font-sans text-lg">{item.name}</p>
                    <div className="flex items-center">
                      <button
                        onClick={() => removeSubCategory(item)}
                        className="text-lg h-9 w-28 flex gap-2 items-center justify-center bg-red-600 text-white rounded-md">
                        Eliminar
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="bg-zinc-200 text-zinc-600 p-1 rounded-md text-xl h-14 flex items-center">
                  Esta categoria aun no tiene sub-categorías.
                </p>
              )}
            </ul>
          </nav>
        </div>
        <hr />
        <input
          hidden
          defaultValue={JSON.stringify(subCategoriesData)}
          name="subcategories"
        />
        <div className="flex justify-between">
          {navigation.state === "submitting" ? (
            <Spinner />
          ) : (
            <Button
              type="submit"
              className="text-lg bg-sky-600 hover:bg-sky-500 w-32 h-14">
              Actualizar
            </Button>
          )}
          <Link
            to={"/panel/categories"}
            className="flex items-center justify-center py-1 px-3 bg-red-600 font-medium text-white text-lg h-14 w-32 rounded-md hover:bg-red-500 transition ease-in">
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
}
