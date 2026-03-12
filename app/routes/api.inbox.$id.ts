import type { Route } from "./+types/api.inbox.$id";
import { updateInboxItem, deleteInboxItem } from "~/lib/db/inbox.server";

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "PUT") {
    try {
      const item = await request.json();
      const updated = await updateInboxItem({ ...item, id: params.id });
      return Response.json(updated);
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    try {
      await deleteInboxItem(params.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
