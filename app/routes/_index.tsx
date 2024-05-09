import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/services/session.server";
import { TbTruckDelivery } from "react-icons/tb";
import jwt from "jsonwebtoken";
import { Product, User } from "@prisma/client";
import { getUserByID } from "~/database/hooks/user.server";
// components
import Container from "~/components/layouts/container";
import Navbar from "~/components/layouts/navbar";
import CategoryBox from "~/components/store/category_box";
import Filter from "~/components/store/filter";
import ProductBox from "~/components/store/product_box";
import Banner from "~/components/layouts/banner";
import BannerSlider from "~/components/layouts/banner_slider";
import { getProducts } from "~/database/hooks/product.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Livied | Ofertas increibles" },
    {
      name: "description",
      content:
        "En LiviedShopping nos esforzamos por brindarte los mejores productos y a buen precio.!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userData;
  const session = await getSession(request.headers.get("Cookie"));
  if (session.data?.token) {
    const user = jwt.verify(
      session.data.token as string,
      process.env.SECRET_KEY as string
    ) as User;
    const userFound = await getUserByID(user.id);
    if (userFound?.role == "ADMIN") return redirect("/panel");
    userData = user;
  }
  const products = (await getProducts()) as Product;
  return { products, userData };
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <Container>
      <header>
        <Navbar user={loaderData.userData} />
      </header>
      <BannerSlider />
      <section className="flex h-fit pt-10">
        <CategoryBox />
        <div className="px-5 w-full">
          <h3 className="font-black text-3xl">OFERTAS</h3>
          <p>¡Grandes ofertas, grandes ahorros, solo para ti!</p>
          <Filter />
          <div className="grid grid-cols-3 gap-10 mt-2">
            {loaderData.products.map((product) => (
              <ProductBox key={product.id} />
            ))}
          </div>
        </div>
      </section>
      <Banner
        backgroundColor="bg-sky-200"
        labelColor="text-sky-800"
        infoColor="text-sky-950"
        icon={
          <TbTruckDelivery
            strokeWidth={1}
            size={180}
            className="text-sky-800"
          />
        }
        label="Tu pedido seguro en camino."
        description="¡Tu envío, nuestra prioridad! En Bahía de Kino, tu paquete se prepara
          para el viaje en menos de 24 horas. Con salidas programadas a
          Hermosillo y Poblado Miguel Aleman los miércoles y sábados, ¡y no te limites! También cubrimos
          envíos a lo largo y ancho de la República Mexicana."
        info="Tienes dudas? aquí las resolvemos"
      />
    </Container>
  );
}
