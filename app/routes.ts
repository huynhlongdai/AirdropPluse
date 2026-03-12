import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  index("routes/home.tsx"),
  route("inbox", "routes/inbox.tsx"),
  route("projects", "routes/projects.tsx"),
  route("wallets", "routes/wallets.tsx"),
  route("tasks", "routes/tasks.tsx"),
  ...devRoutes,
] satisfies RouteConfig;
