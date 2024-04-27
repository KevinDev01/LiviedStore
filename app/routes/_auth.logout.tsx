import { ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession } from "~/services/user.server";

export async function action({ request }: ActionFunctionArgs) {
  return await destroyUserSession(request);
}

export default function () {
  return <p>see more later..</p>;
}
