import type { Route } from "./+types/api.projects.$id.wallets";
import { assignWalletsToProject } from "~/lib/db/projects.server";

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "PUT") {
    try {
      const { walletIds } = await request.json();
      await assignWalletsToProject(params.id, walletIds);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
