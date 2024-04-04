import React, { FC } from "react";

interface CategoryField {
  name: string;
  icon: React.ReactNode;
  color?: string;
  height?: string;
}

const categoryFields = {
  promo: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7 text-red-600 group-hover:scale-105">
      <path
        fillRule="evenodd"
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  sets: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7 text-white">
      <path
        fillRule="evenodd"
        d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.23-10.004 6.072 6.072 0 0 1-.02-.496Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7 text-sky-900">
      <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
      <path
        fillRule="evenodd"
        d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const Category: FC<CategoryField> = ({ name, icon, color, height }) => {
  return (
    <div
      className={`group w-full px-5 ${height ? height : "h-16"} ${
        color ? color : null
      } rounded-md flex items-center justify-between cursor-pointer transition ease-out`}>
      <p className="text-xl font-semibold">{name}</p>
      {icon}
    </div>
  );
};

const CategoryBox = () => {
  return (
    <aside className="w-64 min-w-64 h-fit flex flex-col gap-2 sticky top-10">
      <h2 className="text-lg font-semibold text">Categorías</h2>
      <Category
        name="Ofertas"
        color="bg-amber-400 hover:bg-amber-500"
        icon={categoryFields.promo}
      />
      <Category
        name="Conjuntos"
        color="bg-rose-400 hover:bg-rose-500"
        icon={categoryFields.sets}
        height="h-20"
      />
      <Category
        name="Hogar"
        color="bg-sky-400 hover:bg-sky-500"
        icon={categoryFields.home}
        height="h-20"
      />
    </aside>
  );
};

export default CategoryBox;
