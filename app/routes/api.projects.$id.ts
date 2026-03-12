import type { Route } from "./+types/api.projects.$id";
import { getProject, updateProject, deleteProject } from "~/lib/db/projects.server";

export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProject(params.id);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(project);
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "PUT") {
    try {
      const project = await request.json();
      const updated = await updateProject({ ...project, id: params.id });
      return Response.json(updated);
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    try {
      await deleteProject(params.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
