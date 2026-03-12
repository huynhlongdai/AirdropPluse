import type { Route } from "./+types/api.inbox";
import { getInboxItems, createInboxItem } from "~/lib/db/inbox.server";

export async function loader(_: Route.LoaderArgs) {
  try {
    const items = await getInboxItems();
    return Response.json(items);
  } catch {
    return Response.json([], { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "POST") {
    try {
      const item = await request.json();
      const created = await createInboxItem(item);
      return Response.json(created, { status: 201 });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
