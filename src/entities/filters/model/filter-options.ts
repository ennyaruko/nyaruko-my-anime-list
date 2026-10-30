/** A selectable value exposed by the application's filter controls. */
export type FilterOption = {
  value: string;
  label: string;
};

/** Provider-neutral filter data used by the application. */
export type FilterOptions = {
  genres: FilterOption[];
  tags: (FilterOption & { isAdult: boolean })[];
};
