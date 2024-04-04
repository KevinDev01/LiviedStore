import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { TbTruckDelivery } from "react-icons/tb";
import { RiWhatsappFill } from "react-icons/ri";
import Authenticator from "~/services/auth.server";
// components
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
  const user = await Authenticator.isAuthentic(request);
  return user;
};

export default function Index() {
  const loaderData = useLoaderData() as any;
  console.log(loaderData);
  return (
    <main className="px-24 relative">
      <header>
        <Navbar />
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
      <Link
        target="_blank"
        className="fixed bottom-10 right-6"
        to={`https://wa.me/6622265074?text=¡Hola!%20Estoy%20interesado/a%20en%20obtener%20más%20información%20sobre%20los%20servicios/productos%20ofrecidos%20en%20Livied.%20¿Podrían%20proporcionarme%20detalles%20adicionales?%20¡Gracias!
`}>
        <RiWhatsappFill size={40} className="text-green-600 mx-auto" />
        <p className="text-xs">Contacto</p>
      </Link>
    </main>
  );
}
