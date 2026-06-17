import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  layout("components/app-layout/app-layout.tsx", [
    index("routes/home.tsx"),
    route("inbox", "routes/inbox.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:id", "routes/project-detail.tsx"),
    route("wallets", "routes/wallets.tsx"),
    route("tasks", "routes/tasks.tsx"),
    route("identities", "routes/identities.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
  // API resource routes
  route("api/config", "routes/api.config.ts"),
  route("api/projects", "routes/api.projects.ts"),
  route("api/projects/:id", "routes/api.projects.$id.ts"),
  route("api/projects/:id/wallets", "routes/api.projects.$id.wallets.ts"),
  route("api/tasks", "routes/api.tasks.ts"),
  route("api/tasks/:id", "routes/api.tasks.$id.ts"),
  route("api/inbox", "routes/api.inbox.ts"),
  route("api/inbox/:id", "routes/api.inbox.$id.ts"),
  // Agent Jobs
  route("api/agent-jobs", "routes/api.agent-jobs.ts"),
  route("api/agent-jobs/:id", "routes/api.agent-jobs.$id.ts"),
  ...devRoutes,
] satisfies RouteConfig;
