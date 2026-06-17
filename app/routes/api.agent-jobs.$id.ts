/**
 * GET    /api/agent-jobs/:id  — Fetch a single job
 * PUT    /api/agent-jobs/:id  — Update (agent callback / status patch)
 * DELETE /api/agent-jobs/:id  — Delete a terminal job
 */
import type { Route } from "./+types/api.agent-jobs.$id";
import { getAgentJob, updateAgentJob, cancelAgentJob, deleteAgentJob } from "~/lib/db/agent-jobs.server";

export async function loader({ params }: Route.LoaderArgs) {
  const job = await getAgentJob(params.id);
  if (!job) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(job);
}

export async function action({ request, params }: Route.ActionArgs) {
  // ── PUT: update job (agent runner callback or UI cancel)
  if (request.method === "PUT") {
    try {
      const patch = await request.json();
      const updated = await updateAgentJob(params.id, patch);
      return Response.json(updated);
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }

  // ── PATCH: cancel job
  if (request.method === "PATCH") {
    try {
      const { action: act } = await request.json();
      if (act !== "cancel") {
        return Response.json({ error: "Unknown action" }, { status: 400 });
      }
      const cancelled = await cancelAgentJob(params.id);
      return Response.json(cancelled);
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }

  // ── DELETE: remove the job record
  if (request.method === "DELETE") {
    try {
      await deleteAgentJob(params.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
