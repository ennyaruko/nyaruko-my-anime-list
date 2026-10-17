import { primitives } from "@/shared/styles";

export type SpacingToken = keyof typeof primitives.spacing;

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

export type AlignItem = "start" | "center" | "stretch" | "flex-start";

export type JustifyContent = "center" | "flex-start" | "space-between";
