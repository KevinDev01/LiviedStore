import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/styles/spinner.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const Spinner = () => {
  return (
    <div className="sk-chase">
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  );
};

export default Spinner;
