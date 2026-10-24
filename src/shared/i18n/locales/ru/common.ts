export default {
  title: "Anime List",
  tvSeries: "TV сериал",
  loading: "Загрузка...",
  sortLabel: "Сортировка:",
  emptyResults: "Ничего не найдено",
  progress: {
    label: "Прогресс",
  },
  combobox: {
    placeholder: "Выберите вариант",
  },
  multiSelect: {
    placeholder: "Выберите варианты",
  },
  description: "UI Kit для Anime List на React и TypeScript",
  actions: {
    clearSelection: "Очистить выбранные значения",
  },
  table: {
    showLess: "Свернуть",
    showAll: "Показать ещё...",
  },
  language: {
    label: "Язык",
    english: "English",
    russian: "Русский",
  },
  mediaStatus: {
    released: "Вышел",
    announced: "Анонс",
    ongoing: "Онгоинг",
  },
  blockStatus: {
    notFoundDescription:
      "Возможно, ссылка устарела или в адресе допущена ошибка",
    emptyDescription:
      "Попробуйте изменить параметры поиска или добавить новое аниме",
  },
  errorBoundary: {
    retry: "Повторить",
    reload: "Перезагрузить",
    title: "Ошибка загрузки",
    notFoundTitle: "Страница не найдена",
    description: "Что-то пошло не так. Попробуйте перезагрузить страницу.",
  },
  sort: {
    score: "По рейтингу",
    title: "По названию",
    startDate: "По дате старта",
    popularity: "По популярности",
    releaseDate: "По дате выхода",
    progress: "По прогрессу просмотра",
    completedDate: "По дате завершения",
    averageScore: "По среднему рейтингу",
    lastAdded: "По последнему добавленному",
    lastUpdated: "По последнему обновлению",
  },
} as const;
