import { LoaderFunctionArgs } from "@remix-run/node";
import Authenticator from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await Authenticator.isAdmin(request, {
    failureRedirect: "/",
  });
};

export default function AdminLayout() {
  return <p>AdminLayout</p>;
}
