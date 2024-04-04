import { Link } from "@remix-run/react";

const ProductBox = () => {
  return (
    <Link to={"#"}>
      <article className="relative group bg-neutral-50 h-fit w-72 rounded-md overflow-hidden md:ring-1 md:ring-zinc-200 md:hover:ring-2 md:hover:ring-amber-400 transition ease-out">
        <div className="w-full h-72 overflow-hidden">
          <img
            className="w-full h-72 group-hover:scale-110 transition ease-out"
            src="/resources/Vape-iplay.webp"
          />
        </div>
        <div className="p-2 h-full">
          <p className="text-2xl font-black text-red-600">$300 MXN</p>
          <p className="text-xl font-bold text-neutral-600 line-through">
            $350 MXN
          </p>
          <p className="text-lg text-neutral-800 w-full h-18">
            Vape iPlay Max Coconut Strawberry | 2500 PUFFS | 8ML
          </p>
        </div>
        <button className="h-14 w-full bg-amber-400 text-center text-2xl font-semibold text-zinc-900">
          Agregar al carrito
        </button>
        {/* <CiDiscount1
          className="absolute top-0 -left-0 text-red-500"
          size={50}
        /> */}
      </article>
    </Link>
  );
};

export default ProductBox;
