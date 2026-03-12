import type { Route } from "./+types/api.tasks";
import { getTasks, createTask } from "~/lib/db/tasks.server";

export async function loader(_: Route.LoaderArgs) {
  try {
    const tasks = await getTasks();
    return Response.json(tasks);
  } catch {
    return Response.json([], { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "POST") {
    try {
      const task = await request.json();
      const created = await createTask(task);
      return Response.json(created, { status: 201 });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
