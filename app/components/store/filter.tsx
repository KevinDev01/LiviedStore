import { FC } from "react";

interface FilterArgs {
  name: string;
}

const FilterField: FC<FilterArgs> = ({ name }) => {
  return (
    <button className="group w-fit h-16 px-5 text-xl font-semibold bg-neutral-200 rounded-md flex gap-2 justify-center items-center hover:bg-neutral-300 transition ease-out">
      {name}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 -rotate-90 group-hover:rotate-0 transition ease-out">
        <path
          fillRule="evenodd"
          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

const NavbarFilter = () => {
  return (
    <div className="h-20 mt-3 flex items-center gap-4">
      <FilterField name="Marca" />
      <FilterField name="Precio" />
    </div>
  );
};

export default NavbarFilter;
