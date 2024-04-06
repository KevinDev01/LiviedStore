import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { CartProvider } from "./context/cart.context";
import Contact from "./components/form/contact";
import Footer from "~/components/layouts/footer";

import "~/styles/tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main
          className={
            location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/product/create"
              ? ""
              : "px-10"
          }>
          {children}
          <Contact />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}
