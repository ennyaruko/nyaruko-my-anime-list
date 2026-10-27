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
      route("media/:id", "routes/media-detail.tsx"),
      route("search", "routes/search.tsx"),
      route("*", "routes/not-found.tsx"),
    ]),
  ]),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
