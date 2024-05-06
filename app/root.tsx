import {
  useNavigation,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Toaster } from "sonner";
import { CartProvider } from "./context/cart.context";
import Footer from "~/components/layouts/footer";

import "~/styles/tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {navigation.state === "loading" && (
          <div className="mb-1">
            <div className="h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600 animate-loading-bar overflow-hidden rounded-full"></div>
          </div>
        )}
        <Toaster />
        {children}
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
