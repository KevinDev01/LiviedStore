import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useRouteError,
  useFetcher,
  useActionData,
} from "@remix-run/react";
import { formatterPrice, getDaysToDB, getPriceWithDiscount } from "~/lib/utils";
import { getProductWithRelations } from "~/services/product.server";
import { create_question } from "~/database/hooks/question.server";
// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ProductBox from "~/components/store/product_box";
import { getUserBySession } from "~/services/user.server";
import { toast } from "sonner";
import { TypeOf } from "zod";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await getUserBySession(request);
  if (!user) {
    return json(
      { msg: "Debes iniciar sesión para realizar esta acción", type: "error" },
      { status: 401 }
    );
  }
  const product_id = params.product_id as string;
  const formData = await request.formData();
  const question = formData.get("answer") as string;
  if (question.trim().length === 0)
    return json(
      { msg: "Debes ingresar una pregunta", type: "error" },
      { status: 400 }
    );
  const type = formData.get("type") as string;
  switch (type) {
    case "question":
      const result = await create_question(question, user, product_id);
      console.log(result);
      if (result !== null) {
      }
      break;
    default:
      break;
  }
  return json(
    { msg: "Pregunta realizada con éxito", type: "success" },
    { status: 200 }
  );
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const data = await getProductWithRelations(params.product_id as string);
  if (!data) throw new Error("Ups! algo ha salido mal");
  if (data.product === null) throw new Error("Producto no encontrado");
  return json(data, { status: 200 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Livied | ${data?.product.name}` }];
};

export const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  return <h1>{error.message}</h1>;
};

const stars = Array.from({ length: 5 }, (_, i) => i + 1);

export default function Item() {
  const fetcher = useFetcher<typeof action>();
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const {
    name,
    category,
    subCategory,
    description,
    exclusive,
    amount,
    image,
    image2,
    image3,
    image4,
    price,
    promo,
    discount,
    finalDate,
    porcentage,
    custom_features,
    featuresByCategory,
    questions,
  } = product;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(image);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (image: string) => {
    setSelectedImage(image);
    setZoom(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setZoom(false);
  };

  const handleMouseOver = () => {
    setZoom(true);
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.type === "success") {
        toast.success(fetcher.data.msg);
      } else {
        toast.error(fetcher.data.msg);
      }
    }
  }, [fetcher.data]);

  return (
    <div>
      <div className="mb-2 h-16 bg-indigo-600 flex items-center justify-center rounded-sm">
        <h1 className="text-white text-lg">
          Siempre trataremos de tener los mejores productos para ti y
          enviártelos lo más rápido posible. ❤️
        </h1>
      </div>
      <section className="flex gap-2 h-fit pb-5">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="xl:w-fit 2xl:w-1/2 p-2 space-y-5">
              <div className="flex gap-2">
                <Link
                  to={"/"}
                  className="text-neutral-500 hover:text-neutral-950"
                >
                  Inicio \
                </Link>
                <Link
                  to={`/#`}
                  className="text-neutral-500 hover:text-neutral-950"
                >
                  {category?.name} \
                </Link>
                <Link
                  to={`/#`}
                  className="text-neutral-500 hover:text-neutral-950"
                >
                  {subCategory?.name} \
                </Link>
                <p className="text-blue-500">{name}</p>
              </div>
              <div className="flex gap-3">
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseOver={handleMouseOver}
                  className="p-1 xl:w-[32rem] xl:h-[32rem] 2xl:w-[40rem] 2xl:h-[40rem] rounded-md border shadow-sm overflow-hidden"
                >
                  <img
                    src={selectedImage}
                    alt="placeholder"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      zoom ? "transform scale-150" : ""
                    }`}
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div
                    onMouseEnter={() => handleMouseEnter(image)}
                    className="xl:w-24 xl:h-24 2xl:w-full 2xl:h-[9.45rem] rounded-md border p-1 overflow-hidden hover:cursor-pointer"
                  >
                    <img
                      src={image}
                      alt="placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image2 && (
                    <div
                      onMouseEnter={() => handleMouseEnter(image2)}
                      className="xl:w-24 xl:h-24 2xl:w-full 2xl:h-[9.45rem] rounded-md border overflow-hidden hover:cursor-pointer"
                    >
                      <img
                        src={image2}
                        alt="placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {image3 && (
                    <div
                      onMouseEnter={() => handleMouseEnter(image3)}
                      className="xl:w-24 xl:h-24 2xl:w-full 2xl:h-[9.45rem] rounded-md border overflow-hidden hover:cursor-pointer"
                    >
                      <img
                        src={image3}
                        alt="placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {image4 && (
                    <div
                      onMouseEnter={() => handleMouseEnter(image4)}
                      className="xl:w-24 xl:h-24 2xl:w-full 2xl:h-[9.45rem] rounded-md border overflow-hidden hover:cursor-pointer"
                    >
                      <img
                        src={image4}
                        alt="placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="xl:flex-1 2xl:w-1/2 flex">
              <div className="flex-1 space-y-4">
                <div className="mt-[2.8rem] flex gap-3">
                  <div className="flex justify-center items-center w-fit h-8 px-3 bg-green-500 text-white rounded-md shadow-md">
                    <p className="font-medium text-xs uppercase">NUEVO</p>
                  </div>
                  {exclusive && (
                    <div className="flex justify-center items-center w-fit h-8 px-3 bg-sky-500 text-white rounded-md shadow-md">
                      <p className="font-medium text-xs uppercase">
                        Exclusivo online
                      </p>
                    </div>
                  )}
                </div>
                <h2 className="xl:text-2xl 2xl:text-4xl font-medium">{name}</h2>
                <div className="flex items-center gap-2">
                  {stars.map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-sky-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                  <p className="text-md">5</p>
                  <p className="xl:text-sm 2xl:text-md text-amber-600">
                    623 Reseñas
                  </p>
                  <p className="xl:text-sm 2xl:text-md text-green-800">
                    5600 Vendidos
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {(discount || promo) && (
                    <p className="xl:text-md 2xl:text-3xl opacity-50 line-through">
                      {formatterPrice(price)}
                    </p>
                  )}
                  <h3 className="xl:text-xl 2xl:text-3xl text-sky-600">
                    {discount
                      ? formatterPrice(
                          getPriceWithDiscount(price, porcentage as number)
                        )
                      : promo
                      ? formatterPrice(getPriceWithDiscount(price, promo.value))
                      : formatterPrice(price)}
                  </h3>
                  {(discount || promo) && (
                    <div className="flex flex-col">
                      <p className="text-green-500 font-medium">
                        {discount && porcentage
                          ? porcentage
                          : discount === false && promo
                          ? promo.value
                          : 0}
                        % OFF
                      </p>
                      <p className="text-green-500 font-medium uppercase truncate">
                        {discount && finalDate
                          ? `Quedan solo ${getDaysToDB(finalDate)} días`
                          : discount === false && promo
                          ? `Quedan solo ${getDaysToDB(promo.finalDate)} días`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-neutral-700 text-md">
                  Lo que tienes que saber sobre este producto:
                </p>
                <nav className="list-disc text-sm text-neutral-500 space-y-1">
                  {custom_features.length > 0
                    ? custom_features.map((feature: any) => {
                        if (feature) {
                          return <li key={feature.id}>{feature.name}</li>;
                        }
                        return null;
                      })
                    : null}
                </nav>
                <p className="text-neutral-700 text-md">Color:</p>
                <div className="grid grid-cols-8 gap-3">
                  <div className="relative">
                    <button className="w-8 h-8 rounded-full bg-red-500 peer shadow-sm"></button>
                    <div className="bg-white z-10 absolute w-44 opacity-0 -translate-y-5 shadow-md border p-1 rounded-md peer-hover:opacity-100 peer-hover:translate-y-0 transition ease-in">
                      <p className="text-sm font-medium">Rojo oscuro</p>
                      <p className="text-sm font-mono">Queda 87 unidades</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="w-8 h-8 rounded-full bg-[#82bd69] peer shadow-sm"></button>
                    <div className="bg-white z-10 absolute w-44 opacity-0 -translate-y-5 shadow-md border p-1 rounded-md peer-hover:opacity-100 peer-hover:translate-y-0 transition ease-in">
                      <p className="text-sm font-medium">Azul claro</p>
                      <p className="text-sm font-mono">Queda 15 unidades</p>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-700 text-md">Talla:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-1 w-16 rounded-md border hover:bg-neutral-100 border-neutral-400 font-medium text-center transition ease-in"
                  >
                    S
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-neutral-800 ml-2">
            Características del producto:
          </p>
          <div className="ml-2 flex">
            <table className="w-44">
              <thead>
                <tr className="bg-neutral-200 h-10 pl-2 flex items-center rounded-tl-md">
                  <th className="text-start font-medium">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {featuresByCategory &&
                  Object.keys(featuresByCategory).map((key) => (
                    <tr
                      key={key}
                      className="odd:bg-neutral-100 even:bg-neutral-200 h-10 pl-2 flex items-center"
                    >
                      <td>{key}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <table className="table-auto flex-1">
              <thead>
                <tr className="bg-neutral-100 h-10 pl-2 flex items-center rounded-tr-md">
                  <th className="text-start font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody className="">
                {featuresByCategory &&
                  Object.values(featuresByCategory).map((value: any) => (
                    <tr
                      key={value}
                      className="odd:bg-neutral-200 even:bg-neutral-100 h-10 pl-2 flex items-center"
                    >
                      <td>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-xl text-neutral-800 ml-2">
            Productos relacionados al que estas mirando:
          </p>
          <div className="grid grid-cols-3">
            {relatedProducts !== null &&
              relatedProducts.map((product) => (
                <ProductBox key={product.id} product={product} />
              ))}
          </div>
          <p className="text-xl text-neutral-800 ml-2">Descripción:</p>
          <p className="text-lg text-neutral-800 ml-2">{description}</p>
          <p className="text-lg font-medium text-neutral-800 ml-2">
            Preguntas y respuestas:
          </p>
          <p className="text-md text-neutral-800 ml-2">Que quieres saber?</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-10 w-fit px-3 font-medium bg-sky-100 text-sky-600 rounded-md"
            >
              Devolucion gratis
            </button>
            <button
              type="button"
              className="h-10 w-fit px-3 font-medium bg-sky-100 text-sky-600 rounded-md"
            >
              Garantia
            </button>
            <button
              type="button"
              className="h-10 w-fit px-3 font-medium bg-sky-100 text-sky-600 rounded-md"
            >
              Medios de pago permitidos
            </button>
          </div>
          <fetcher.Form method="post" className="ml-2 space-y-2 relative w-fit">
            <p className="text-lg font-medium text-neutral-800 block">
              Resuelve tus dudas
            </p>
            <button
              type="submit"
              className="absolute right-0 flex justify-center items-center w-12 h-12 bg-sky-500 rounded-r-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 font-bold text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
            <input
              id="answer"
              name="answer"
              type="text"
              className="border border-neutral-300 h-12 text-lg rounded-md shadow-sm w-[40rem] pl-2 pr-12 focus:outline-none focus:border-sky-200 focus:ring-2 focus:ring-sky-500 placeholder:font-light placeholder-neutral-400 transition ease"
              placeholder="Ingresa tu duda o palabra clave"
              required
            />
            <input name="type" type="hidden" value="question" />
          </fetcher.Form>
          <p className="text-lg font-medium text-neutral-800 ml-2">
            Ultimas realizadas
          </p>
          <div className="pl-4 space-y-3">
            {questions && questions.length > 0 ? (
              questions.map(({ answer, question, id }) => (
                <div key={id} className="space-y-1">
                  <p className="text-lg text-neutral-800">{question}</p>
                  <p className="before:content-[' '] before:w-[14px] before:h-[14px] before:absolute before:-left-7 before:block before:ml-2 before:border-l before:border-b font-light text-md text-neutral-700 ml-6 relative">
                    {answer ? answer : "Aun no hay respuesta"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-md text-neutral-500">
                Aun no existen preguntas realiza una si tienes dudas.
              </p>
            )}
          </div>
        </div>
        {/* product checkout */}
        <div className="border rounded-md w-80 h-fit mt-10 shadow-lg sticky top-5 py-3 px-2 flex flex-col space-y-3">
          <div className="space-y-3">
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              <p className="text-neutral-700 text-md">
                <span className="text-green-500">Envió gratis</span> a todo el
                país
              </p>
            </div>
            <hr />
            <p className="xl:text-md 2xl:text-xl font-normal">{name}</p>
            <div className="flex gap-2 text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <p className="text-md font-light">Stock disponible</p>
            </div>

            <p className="text-md font-light">
              Selecciona la cantidad que deseas
            </p>
            <div className="flex gap-2 items-center">
              <Select onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: amount }, (_, i) => i + 1).map(
                    (option) => (
                      <SelectItem
                        key={option.toString()}
                        value={option.toString()}
                      >
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <p className="text-md font-light text-neutral-500">
                (+{amount} disponibles)
              </p>
            </div>
            {/* <Form className="space-y-2">
                <label
                  htmlFor="cupon"
                  className="text-orange-500 text-md font-light">
                  Aplicar cupon
                </label>
                <input
                  id="cupon"
                  className="w-full h-12 bg-orange-100 border-orange-200 ring-1 ring-orange-400 rounded-md text-orange-500 placeholder:text-orange-300 text-center text-xl font-medium hover:focus-none focus:outline-none focus:shadow-md focus:shadow-orange-300 transition ease-in"
                />
              </Form> */}
            <nav className="space-y-2">
              <ul className="flex justify-between">
                <li>Color:</li>
                <li>Rojo</li>
              </ul>
            </nav>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>SubTotal:</p>
            {/* <p>{formatterPrice(quantity * price)}</p> */}
            <p>
              {discount
                ? formatterPrice(
                    getPriceWithDiscount(price, porcentage as number) * quantity
                  )
                : promo
                ? getPriceWithDiscount(price, promo.value)
                : formatterPrice(price)}
            </p>
          </div>
          <hr />
          <div className="space-y-3">
            <button className="w-full bg-sky-500 text-white text-xl py-2 rounded-md shadow-md hover:shadow-lg hover:shadow-sky-300 transition ease-in">
              Agregar al carrito
            </button>
            <div className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>

              <p className="text-md font-light">
                <span className="text-sky-600">Devolución gratis.</span> tienes
                30 Dias desde que lo recibes.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <p className="text-md font-light">
                <span className="text-sky-600">Compra protegida.</span> recibe
                el producto que esperabas o te devolvemos tu dinero.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
