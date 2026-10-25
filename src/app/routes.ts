import {
  index,
  route,
  layout,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/layouts/authenticated-layout.tsx", [
    layout("routes/layouts/app-layout.tsx", [
      index("routes/home.tsx"),
      route("search", "routes/search.tsx"),
    ]),
  ]),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
