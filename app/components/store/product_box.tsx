import { Promo } from "@prisma/client";
import { Link } from "@remix-run/react";
import { formatterPrice, getDaysToDB, getPriceWithDiscount } from "~/lib/utils";

type ProductBoxProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: boolean;
  porcentage: number | null;
  exclusive: boolean;
  amount: number;
  img: string;
  finalDate: string | null;
  promo: Promo | null;
};

const ProductBox = ({ item }: { item: ProductBoxProps }) => {
  const {
    id,
    discount,
    name,
    amount,
    price,
    porcentage,
    exclusive,
    description,
    img: image,
    finalDate,
    promo,
  } = item;

  return (
    <Link
      to={`/product/${id}`}
      className="block group w-80 min-w-80 max-w-80 h-[32rem] p-2 bg-white border rounded-md shadow-md space-y-2 hover:shadow-xl transition ease-in">
      <div className="overflow-hidden p-1 rounded-md h-60">
        <img
          src={image}
          className="h-60 scale-110 w-full group-hover:scale-125 transition ease-in"
          loading="lazy"
        />
      </div>
      <hr />
      <h3 className="font-medium group-hover:text-blue-600 text-lg truncate">
        {name}
      </h3>
      {/* estrellas */}
      <div className="flex gap-2 items-center">
        <p className="font-light text-sm">5</p>
        <div className="flex text-sky-500 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-light text-sm">145 reseñas</p>
      </div>

      <div className="flex gap-2 items-center">
        <div className="w-fit bg-rose-500 p-1 rounded-md shadow-md">
          <p className="font-semibold text-white text-xs uppercase">
            Nuevo Item
          </p>
        </div>
        {discount === true || promo?.id ? (
          <div className="w-fit bg-red-500 text-white px-3 py-1 rounded-md shadow-md">
            <p className="font-medium text-xs uppercase">Oferta</p>
          </div>
        ) : null}
        {exclusive && (
          <div className="w-fit bg-sky-500 text-white px-3 py-1 rounded-md shadow-md">
            <p className="font-medium text-xs uppercase">Exclusivo online</p>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="block text-2xl font-medium">
            {discount && price !== 0 && porcentage !== 0 && porcentage !== null
              ? getPriceWithDiscount(price, porcentage)
              : promo?.value &&
                promo.value > 0 &&
                price !== 0 &&
                discount === false
              ? getPriceWithDiscount(price, promo?.value)
              : formatterPrice(price)}
          </p>
          {(discount || promo?.id) && (
            <p className="ml-1 text-sm text-green-600 font-medium">
              {porcentage
                ? porcentage
                : promo?.value
                ? promo?.value.toString()
                : "0"}
              % OFF
            </p>
          )}
          {discount && finalDate ? (
            <p className="ml-1 text-green-600 font-medium text-sm uppercase text-center">
              Quedan {getDaysToDB(finalDate.toString())} dias
            </p>
          ) : promo?.id && promo?.finalDate ? (
            <p className="ml-1 text-green-600 font-medium text-sm uppercase text-center">
              Quedan {getDaysToDB(promo?.finalDate.toString())} dias
            </p>
          ) : null}
        </div>
        {(discount || promo?.id) && (
          <p className="line-through text-sm text-neutral-500">
            {formatterPrice(price)}
          </p>
        )}
      </div>
      <p className="font-light">{amount ? amount : 0} Disponibles</p>
      <p className="line-clamp-2">
        {description ? description : "Descripción del producto"}
      </p>
    </Link>
  );
};

export default ProductBox;
