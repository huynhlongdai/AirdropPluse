import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  layout("components/app-layout/app-layout.tsx", [
    index("routes/home.tsx"),
    route("inbox", "routes/inbox.tsx"),
    route("projects", "routes/projects.tsx"),
    route("wallets", "routes/wallets.tsx"),
    route("tasks", "routes/tasks.tsx"),
    route("identities", "routes/identities.tsx"),
  ]),
  ...devRoutes,
] satisfies RouteConfig;
