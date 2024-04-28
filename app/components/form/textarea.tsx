import { FC } from "react";

interface TextAreaFieldsProps {
  id: string;
  name: string;
  label: string;
  description?: string;
  error?: React.ReactNode;
  width: string;
  height: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const TextArea: FC<TextAreaFieldsProps> = ({
  id,
  name,
  label,
  description,
  error,
  width,
  height,
  handleChange,
  value,
}) => {
  return (
    <div className={`relative ${width} ${height} mx-auto`}>
      <textarea
        onChange={handleChange}
        defaultValue={value}
        placeholder=" "
        name={name}
        id={id}
        className={`${
          error
            ? "border-red-400 placeholder-shown:border-red-400"
            : "border-sky-400 placeholder-shown:border-stone-300"
        } relative peer block w-full h-full px-2 border resize-none invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 text-lg rounded-md shadow-md shadow-neutral-100 md:focus:outline-none focus:valid:border-sky-400 focus:valid:ring-2 focus:valid:ring-sky-200 focus:invalid:border-red-400 focus:invalid:ring-2 focus:invalid:ring-red-100`}
      />
      <label
        htmlFor={id}
        className="absolute top-14 -translate-y-[84px] peer-placeholder-shown:-translate-y-10 peer-focus:-translate-y-[84px] translate-x-2 transition duration-300">
        {label}
      </label>
      {error}
      <p className="text-sm ml-2 font-semibold">
        {description}
        <span className="text-red-400 text-lg font-bold">*</span>
      </p>
    </div>
  );
};

export default TextArea;
