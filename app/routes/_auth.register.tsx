import { FC } from "react";
import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  json,
  useLoaderData,
} from "@remix-run/react";
import type { ValidationErrors } from "~/lib/types";
import { getSession, commitSession } from "~/services/session.server";
import Authenticator from "~/services/auth.server";

// components
import Input from "~/components/form/input";
import Spinner from "~/components/form/spinner";
import Button from "~/components/form/button";

interface AlertProps {
  message: string;
}

type DataResponse = {
  error: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Livied | Crear cuenta" },
    {
      name: "description",
      content:
        "Registrate en LiviedStore para brindarte los mejores productos y a buen precio.!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await Authenticator.register(request, {
    failureRedirect: "/register",
    successRedirect: "/",
  });
};

const Alert: FC<AlertProps> = ({ message }) => {
  return (
    <p className="text-red-600 p-1 bg-red-100 mt-2 rounded-md flex gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      {message}
    </p>
  );
};

function Register() {
  const loaderData = useLoaderData() as DataResponse;
  const actionData = useActionData() as ValidationErrors;
  const navigation = useNavigation();
  return (
    <>
      <div className="w-1/2 bg-amber-500"></div>
      <div className="w-1/2 px-5 pt-16 pb-8">
        <h1 className="text-2xl text-center font-semibold">Crear cuenta</h1>
        {loaderData?.error && (
          <p className="mt-2 text-center text-red-600">{loaderData?.error}</p>
        )}
        <Form className="space-y-8 pt-7" method="POST">
          <Input
            id="name"
            name="name"
            label="Nombre"
            type="text"
            description="Ingresa tu nombre"
            pattern="[A-Za-z]+"
            error={actionData?.name && <Alert message={actionData.name} />}
          />
          <Input
            id="lastname"
            name="lastname"
            label="Apellido"
            type="text"
            description="Ingresa tu correo apellido"
            pattern="[A-Za-z]+"
            error={
              actionData?.lastname && <Alert message={actionData.lastname} />
            }
          />
          <Input
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            description="Ingresa tu correo electrónico"
            error={actionData?.email && <Alert message={actionData.email} />}
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            description="Ingresa tu password"
            min={8}
            error={
              actionData?.password && <Alert message={actionData.password} />
            }
          />
          <Input
            id="repeatPassword"
            name="repeatPassword"
            label="Repite password"
            type="password"
            description="Ingresa de nuevo tu password"
            min={8}
            error={
              actionData?.repeatPassword && (
                <Alert message={actionData.repeatPassword} />
              )
            }
          />
          <div className="w-96 mx-auto flex gap-2">
            <input
              id="connect"
              type="checkbox"
              value={"true"}
              className="w-5 h-5"
            />
            <label htmlFor="connect" className="font-semibold text-sm">
              Quiero recibir promociones de LiviedStore
            </label>
          </div>
          <div className="w-96 mx-auto flex justify-end">
            {navigation.state === "submitting" ? (
              <Spinner />
            ) : (
              <Button type={"submit"} label="Crear cuenta" />
            )}
          </div>
          <div className="w-96 mx-auto flex justify-around">
            <p>Ya tienes una cuenta?</p>
            <Link
              to={"/login"}
              className="text-sky-600 underline font-semibold">
              Iniciar session
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Register;
