/**
 * POST /api/agent-jobs   — Dispatch a new agent job
 * GET  /api/agent-jobs   — List all jobs (optional ?taskId= filter)
 */
import type { Route } from "./+types/api.agent-jobs";
import { getAgentJobs, getJobsForTask, createAgentJob } from "~/lib/db/agent-jobs.server";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId");

    const jobs = taskId ? await getJobsForTask(taskId) : await getAgentJobs();
    return Response.json(jobs);
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.taskId || !body.identityId) {
      return Response.json({ error: "taskId and identityId are required" }, { status: 400 });
    }

    const job = await createAgentJob({
      taskId:       body.taskId,
      identityId:   body.identityId,
      walletId:     body.walletId,
      name:         body.name || `Job for task ${body.taskId}`,
      instructions: body.instructions,
    });

    return Response.json(job, { status: 201 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
