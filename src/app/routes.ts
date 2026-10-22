import {
  index,
  route,
  layout,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/layouts/authenticated-layout.tsx", [index("routes/home.tsx")]),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
