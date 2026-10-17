import type ru from "../ru/common";

const common = {
  title: "Anime List",
  loading: "Loading...",
  emptyResults: "No results found",
  progress: {
    label: "Progress",
  },
  combobox: {
    placeholder: "Select an option",
  },
  multiSelect: {
    placeholder: "Select options",
  },
  actions: {
    clearSelection: "Clear selection",
  },
  description: "Anime List UI built with React and TypeScript",
  table: {
    showLess: "Show less",
    showAll: "Show more...",
  },
  language: {
    label: "Language",
    russian: "Русский",
    english: "English",
  },
  mediaStatus: {
    ongoing: "Ongoing",
    released: "Released",
    announced: "Announced",
  },
  watchStatus: {
    onHold: "On hold",
    dropped: "Dropped",
    planned: "Planned",
    watching: "Watching",
    completed: "Completed",
  },
} satisfies typeof ru;

export default common;
