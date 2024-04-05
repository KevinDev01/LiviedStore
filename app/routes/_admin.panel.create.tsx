import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Input from "~/components/form/input";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | nuevo producto" }];
};

export default function Create() {
  return (
    <>
      <h2 className="text-md">Nuevo producto</h2>
      <Form method="post">
        <Input
          id="name"
          type="text"
          label="Nombre"
          description="Ingresa el nombre del producto"
          name="name"
        />
      </Form>
    </>
  );
}
