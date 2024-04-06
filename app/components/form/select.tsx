import { useState, FC } from "react";

type CategoryField = {
  name: string;
  value: number;
};

interface SelectFieldsProps {
  label: string;
  description: string;
  headerTitle: string;
  id: string;
  name: string;
  fields: CategoryField[];
}

const Select: FC<SelectFieldsProps> = ({
  name,
  description,
  headerTitle,
  label,
  id,
  fields,
}) => {
  const [value, setValue] = useState<number | undefined>();
  const [updateLabel, setUpdateLabel] = useState(label);
  console.log(value);
  return (
    <div className="relative mt-2">
      <label
        htmlFor={id}
        className="flex gap-3 items-center px-2 h-14 w-fit cursor-pointer border rounded-md shadow-md">
        {updateLabel}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </label>
      <p className="block pl-2 font-medium text-sm mt-1">
        {description}
        <span className="text-lg text-red-500">*</span>
      </p>
      <select id={id} name={name} className="peer opacity-0"></select>
      <div className="bg-white shadow-lg absolute top-0 left-52 z-10 w-72 h-0 opacity-0 translate-y-10 peer-focus:h-fit peer-focus:py-2 peer-focus:opacity-100 peer-focus:-translate-y-0 peer-focus:border space-y-1 rounded-lg overflow-hidden transition ease-out">
        <div className="px-2">
          <p className="font-semibold">{headerTitle}</p>
          <p className="block truncate w-full text-sm">{description}</p>
        </div>
        <hr className="border border-stone-200" />
        <div className="p-1 overflow-y-auto max-h-96">
          <div className="space-y-2">
            {fields.map((field) => (
              <div
                key={field.value}
                onClick={() => {
                  setValue(field.value);
                  setUpdateLabel(field.name);
                }}
                className="flex items-center w-full h-10 px-2 hover:bg-neutral-100 transition ease-out text-md rounded-md hover:cursor-pointer hover:underline">
                {field.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Select;
