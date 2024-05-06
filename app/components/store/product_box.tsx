import { Link } from "@remix-run/react";

const ProductBox = () => {
  return (
    <Link
      to={"#"}
      className="block group w-80 min-w-80 max-w-80 h-[32rem] p-2 bg-white border rounded-md shadow-md space-y-2 hover:shadow-xl transition ease-in">
      <div className="overflow-hidden p-1 rounded-md h-60">
        <img
          src="/resources/Vape-iplay.webp"
          className="h-60 scale-110 w-full group-hover:scale-125 transition ease-in"
          loading="lazy"
        />
      </div>
      <hr />
      <h3 className="font-medium group-hover:text-blue-600">
        Zapatos Deportivos Nike Air Max 270
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
        <div className="w-fit bg-orange-500 p-1 rounded-md shadow-md">
          <p className="font-semibold text-white text-xs uppercase">
            Mas vendido
          </p>
        </div>
        <div className="w-fit bg-red-500 text-white px-3 py-1 rounded-md shadow-md">
          <p className="font-medium text-xs uppercase">Oferta</p>
        </div>
        <div className="w-fit bg-sky-500 text-white px-3 py-1 rounded-md shadow-md">
          <p className="font-medium text-xs uppercase">Exclusivo online</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="block text-2xl font-medium">$2000</p>
          <p className="block text-sm text-green-600">23% OFF</p>
        </div>
        <p className="line-through text-sm text-neutral-500">Anterior $2800</p>
      </div>
      <p className="font-light">4 Disponibles</p>
      <p className="line-clamp-2">
        Experimenta la combinación perfecta de comodidad y estilo con los
        zapatos deportivos Nike Air Max 270. Con su diseño innovador y
        tecnología de amortiguación Air Max, estos zapatos te proporcionarán el
        máximo confort en cada paso que des.
      </p>
    </Link>
  );
};

export default ProductBox;
