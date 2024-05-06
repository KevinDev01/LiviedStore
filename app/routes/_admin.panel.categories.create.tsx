import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import jwt from "jsonwebtoken";
import { createCategory } from "~/database/hooks/category.server";
import { getSession } from "~/services/session.server";
import Spinner from "~/components/form/spinner";
import Input from "~/components/form/input";
import { Button } from "~/components/ui/button";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const categoryName = formData.get("category") as string;
  if (categoryName.length <= 0)
    return json({ message: "El campo no puede ir vació." });
  try {
    const user = jwt.verify(
      session.data.token as string,
      process.env.SECRET_KEY as string
    );
    if (!user) throw new Error("No existe usuario alguno");
    await createCategory(categoryName as string);
  } catch (error) {
    console.log(error);
    return null;
  }
  return redirect("/panel/categories");
};

export default function create_categories() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  return (
    <div className="px-2 w-full">
      <Form method="post" className="space-y-3 mt-8 w-1/2">
        <Input
          label="Nueva categoría"
          id="category"
          name="category"
          type="text"
          description="Ingresa el nombre de la nueva categoría"
          min={3}
          pattern="[A-Za-z\s]+"
          error={actionData?.message}
        />
        <div className="flex justify-between">
          {navigation.state === "submitting" ? (
            <Spinner />
          ) : (
            <Button
              type="submit"
              className="text-lg bg-sky-600 hover:bg-sky-500 w-28">
              Crear
            </Button>
          )}
          <Link
            to={"/panel/categories"}
            className="flex items-center py-1 px-3 bg-red-600 font-medium text-white text-lg h-10 w-fit rounded-md hover:bg-red-500 transition ease-in">
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
}
