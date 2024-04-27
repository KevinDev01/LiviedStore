import { FC } from "react";

interface InputFieldsProps {
  id: string;
  name: string;
  type: string;
  label: string;
  description?: string;
  pattern?: string;
  min?: number;
  error?: React.ReactNode;
  width?: string;
  disabled?: boolean;
  orientation?: string;
  value?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputFieldsProps> = ({
  id,
  name,
  type,
  label,
  description,
  pattern,
  min,
  error,
  width,
  disabled,
  orientation,
  value,
  handleChange,
}) => {
  return (
    <div
      className={`relative ${width} ${
        orientation === "center" ? "mx-auto" : null
      }`}>
      <input
        defaultValue={value}
        disabled={disabled}
        minLength={min}
        placeholder=" "
        pattern={pattern}
        type={type}
        name={name}
        id={id}
        className={`${
          error
            ? "border-red-400 placeholder-shown:border-red-400"
            : "border-sky-400 placeholder-shown:border-stone-200"
        } relative peer block w-full h-14 px-2 border invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 text-lg rounded-md md:focus:outline-none focus:valid:border-sky-400 focus:valid:ring-2 focus:valid:ring-sky-200 focus:invalid:border-red-400 focus:invalid:ring-2 focus:invalid:ring-red-100 hover:bg-neutral-50 disabled:bg-transparent disabled:border-neutral-100 disabled:text-neutral-200`}
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className="absolute -translate-y-[84px] peer-placeholder-shown:-translate-y-10 peer-focus:-translate-y-[84px] translate-x-2 transition duration-300 peer-disabled:text-neutral-400">
        {label}
      </label>
      <p
        className={`${
          error ? "py-1 px-2" : null
        } bg-red-100 text-red-500 font-medium rounded-md block mt-2`}>
        {error}
      </p>
      <p className="text-sm ml-2 font-semibold peer-disabled:opacity-50">
        {description}
        <span className="text-red-400 text-lg font-bold">*</span>
      </p>
    </div>
  );
};

export default Input;
