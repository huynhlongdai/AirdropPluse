import type { Route } from "./+types/api.tasks.$id";
import { getTask, updateTask, deleteTask } from "~/lib/db/tasks.server";

export async function loader({ params }: Route.LoaderArgs) {
  const task = await getTask(params.id);
  if (!task) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(task);
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "PUT") {
    try {
      const task = await request.json();
      const updated = await updateTask({ ...task, id: params.id });
      return Response.json(updated);
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    try {
      await deleteTask(params.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
