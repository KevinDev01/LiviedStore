import { Outlet } from "@remix-run/react";

export default function ProductLayout() {
  return (
    <div className="flex">
      <Outlet />
    </div>
  );
}
