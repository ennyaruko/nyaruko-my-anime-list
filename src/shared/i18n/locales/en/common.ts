export default {
  sortLabel: "Sort:",
  title: "Anime List",
  loading: "Loading...",
  tvSeries: "TV series",
  emptyResults: "No results found",
  language: {
    label: "Language",
  },
  progress: {
    label: "Progress",
  },
  combobox: {
    placeholder: "Select an option",
  },
  actions: {
    clearSelection: "Clear selection",
  },
  multiSelect: {
    placeholder: "Select options",
  },
  search: {
    placeholder: "Anime title from my list",
  },
  description: "Anime List UI built with React and TypeScript",
  table: {
    showLess: "Show less",
    showAll: "Show more...",
  },
  list: {
    list: "List",
    tags: "Tags",
    genres: "Genres",
  },
  navigation: {
    search: "Search",
    profile: "Profile",
    myAnime: "My Anime",
  },
  mediaStatus: {
    ongoing: "Ongoing",
    released: "Released",
    announced: "Announced",
  },
  validation: {
    loginRequired: "Username is required",
    passwordRequired: "Password is required",
    loginLatinOnly: "Username must not contain Cyrillic characters",
  },
  blockStatus: {
    emptyDescription: "Try changing your search criteria or adding a new anime",
    notFoundDescription:
      "The link may be outdated or the address may contain an error",
  },
  errorBoundary: {
    reload: "Reload",
    retry: "Try again",
    title: "Something went wrong",
    notFoundTitle: "Page not found",
    description: "Something went wrong. Try reloading the page.",
  },
  profileMenu: {
    logout: "Log out",
    session: "Session",
    settings: "Settings",
    darkTheme: "Dark theme",
    lightTheme: "Light theme",
    adultContent: "18+ Content",
    provider: "{{provider}} API",
  },
  ui: {
    filters: {
      close: "Close",
      open: "Filters",
      title: "List filters",
    },
    watchStatus: {
      paused: "On hold",
      dropped: "Dropped",
      planned: "Planned",
      watching: "Watching",
      completed: "Completed",
    },
  },
  login: {
    title: "Sign in",
    retry: "Try again",
    continueWithProvider: "Continue with {{provider}}",
    description: "On this page, you will be able to log in to our website.",
    authFailed:
      "AniList authorization could not be completed. Please try again.",
  },
  sort: {
    score: "By Score",
    title: "By Title",
    lastAdded: "By Date Added",
    startDate: "By Start Date",
    popularity: "By Popularity",
    lastUpdated: "By Last Updated",
    releaseDate: "By Release Date",
    progress: "By Viewing Progress",
    averageScore: "By Average Score",
    completedDate: "By Completion Date",
  },
} as const;
