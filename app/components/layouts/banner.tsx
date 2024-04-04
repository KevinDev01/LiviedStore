import { FC } from "react";
import { Link } from "@remix-run/react";

interface BannerFields {
  icon: React.ReactNode;
  label: string;
  description: string;
  info?: string;
  links?: string;
  columns?: number;
  backgroundColor: string;
  labelColor: string;
  infoColor: string;
}

const Banner: FC<BannerFields> = ({
  icon,
  label,
  description,
  info,
  links,
  columns,
  backgroundColor,
  labelColor,
  infoColor,
}) => {
  return (
    <section
      className={`${backgroundColor} h-72 mt-5 px-4 flex items-center gap-2 rounded-sm`}>
      <div
        className={`${
          columns ? "w-1/2 flex justify-center items-center" : "w-fit px-10"
        }`}>
        {icon ? icon : null}
      </div>
      <div className={`space-y-2 ${columns ? "w-1/2" : "w-full"}`}>
        <p className={`text-4xl font-bold ${labelColor}`}>{label}</p>
        <p className="text-lg">{description}</p>
        <div className={`${infoColor}`}>
          <p className="font-semibold">{info}</p>
          <div className="flex gap-2 w-full mt-2">
            <Link
              to={"/ayuda"}
              className="px-2 flex justify-center items-center bg-sky-300 h-12 rounded-md hover:bg-sky-400 transition ease-out">
              Como realizar un pedido?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
