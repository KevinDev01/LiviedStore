import { FC } from "react";

interface ButtonProps {
  type: any;
  label: string;
  value?: string;
}

const Button: FC<ButtonProps> = ({ type, label, value }) => {
  return (
    <button
      type={type}
      className="h-12 w-32 px-1 block bg-sky-200 text-sky-600 text-md font-semibold rounded-md hover:bg-sky-300 hover:text-sky-700 transition ease-out">
      {label}
    </button>
  );
};

export default Button;
