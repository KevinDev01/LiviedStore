import { Outlet, useNavigation } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserBySession, isAdmin } from "~/services/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserBySession(request);
  if (user === null) return redirect("/");
  return isAdmin(user);
};

export default function AdminLayout() {
  return <Outlet />;
}
