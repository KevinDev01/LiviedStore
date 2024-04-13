import { Outlet } from "@remix-run/react";

export default function ProductLayout() {
  return (
    <main className="flex h-fit">
      <Outlet />
    </main>
  );
}
