/** A selectable value exposed by the application's filter controls. */
export type FilterOption = {
  value: string;
  label: string;
};

/** Provider-neutral filter data used by the application. */
export type FilterOptions = {
  tags: FilterOption[];
  genres: FilterOption[];
};
