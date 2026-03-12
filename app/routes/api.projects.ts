import type { Route } from "./+types/api.projects";
import { getProjects, createProject } from "~/lib/db/projects.server";

export async function loader(_: Route.LoaderArgs) {
  try {
    const projects = await getProjects();
    return Response.json(projects);
  } catch (e) {
    return Response.json([], { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "POST") {
    try {
      const project = await request.json();
      const created = await createProject(project);
      return Response.json(created, { status: 201 });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
