import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TbTruckDelivery } from "react-icons/tb";
import Authenticator from "~/services/auth.server";
// components
import Container from "~/components/layouts/container";
import Navbar from "~/components/layouts/navbar";
import CategoryBox from "~/components/store/category_box";
import Filter from "~/components/store/filter";
import ProductBox from "~/components/store/product_box";
import Banner from "~/components/layouts/banner";
import BannerSlider from "~/components/layouts/banner_slider";

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
  const user = await Authenticator.getUser(request);
  const response = {
    user,
  };
  return response;
};

export default function Index() {
  const loaderData = useLoaderData() as any;
  return (
    <Container>
      <header>
        <Navbar user={loaderData.user} />
      </header>
      <BannerSlider />
      <section className="flex h-fit pt-10">
        <CategoryBox />
        <div className="px-5 w-full">
          <h3 className="font-black text-3xl">OFERTAS</h3>
          <p>¡Grandes ofertas, grandes ahorros, solo para ti!</p>
          <Filter />
          <div className="grid grid-cols-3 gap-10 mt-2">
            <ProductBox />
            <ProductBox />
            <ProductBox />
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
