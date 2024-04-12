import { Outlet } from "@remix-run/react";

export default function ProductLayout() {
  return (
    <div className="flex bg-hero-product bg-top h-fit">
      <Outlet />
    </div>
  );
}
