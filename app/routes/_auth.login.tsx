import { FC } from "react";
import {
  type MetaFunction,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  json,
} from "@remix-run/react";
import Authenticator from "~/services/auth.server";
import { getSession, commitSession } from "~/services/session.server";
import { ValidationErrors } from "~/lib/types";

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
    { title: "Livied | Iniciar session" },
    {
      name: "description",
      content:
        "Inicia session en LiviedStore para poder brindarte los mejores productos y a buen precio.!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("token")) {
    return redirect("/");
  }
  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await Authenticator.login(request, {
    failureRedirect: "/login",
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

function Login() {
  const loaderData = useLoaderData() as DataResponse;
  const actionData = useActionData() as ValidationErrors;
  const navigation = useNavigation();
  return (
    <>
      <div className="w-1/2 bg-hero-login bg-center bg-cover"></div>
      <div className="w-1/2 px-5 pt-16">
        <h1 className="text-2xl text-center font-semibold">Iniciar session</h1>
        {loaderData?.error && (
          <p className="mt-2 text-center text-red-600">{loaderData?.error}</p>
        )}
        <Form className="space-y-8 pt-7" method="post">
          <Input
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            description="Ingresa tu correo electrónico"
            error={actionData?.email && <Alert message={actionData.email} />}
            width="w-96"
            orientation="center"
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
            width="w-96"
            orientation="center"
          />
          <div className="w-96 mx-auto flex gap-2">
            <input
              id="connect"
              type="checkbox"
              value={"true"}
              className="w-5 h-5"
            />
            <label htmlFor="connect" className="font-semibold text-sm">
              Permanecer conectado
            </label>
          </div>
          <div className="w-96 mx-auto flex justify-end">
            {navigation.state === "submitting" ? (
              <Spinner />
            ) : (
              <Button type={"submit"} label={"Login"} />
            )}
          </div>
          <div className="w-96 mx-auto flex justify-around">
            <p>Aun no tienes una cuenta?</p>
            <Link
              to={"/register"}
              className="text-sky-600 underline font-semibold">
              Crear cuenta
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Login;
