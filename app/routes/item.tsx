import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/layouts/container";
import Navbar from "~/components/layouts/navbar";
import { getUserBySession } from "~/services/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserBySession(request);
  return { user };
};

export default function Item() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Container>
      <header>
        <Navbar data={user} />
      </header>
      <Outlet />
    </Container>
  );
}
