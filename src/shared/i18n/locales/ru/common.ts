export default {
  title: "Anime List",
  tvSeries: "TV сериал",
  loading: "Загрузка...",
  sortLabel: "Сортировка:",
  emptyResults: "Ничего не найдено",
  language: {
    label: "Язык",
  },
  progress: {
    label: "Прогресс",
  },
  search: {
    placeholder: "Введите название",
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
  list: {
    tags: "Теги",
    list: "Список",
    genres: "Жанры",
  },
  table: {
    showLess: "Свернуть",
    showAll: "Показать ещё...",
  },
  navigation: {
    search: "Поиск",
    profile: "Профиль",
    myAnime: "Моё аниме",
  },
  mediaStatus: {
    released: "Вышел",
    announced: "Анонс",
    ongoing: "Онгоинг",
  },
  validation: {
    passwordRequired: "Введите пароль",
    loginRequired: "Введите имя пользователя",
    loginLatinOnly: "Имя пользователя не должно содержать кириллицу",
  },
  blockStatus: {
    notFoundDescription:
      "Возможно, ссылка устарела или в адресе допущена ошибка",
    emptyDescription:
      "Попробуйте изменить параметры поиска или добавить новое аниме",
  },
  profileMenu: {
    logout: "Выход",
    session: "Сессия",
    settings: "Настройки",
    darkTheme: "Темная тема",
    lightTheme: "Светлая тема",
    adultContent: "18+ Контент",
    provider: "{{provider}} API",
  },
  errorBoundary: {
    retry: "Повторить",
    reload: "Перезагрузить",
    title: "Ошибка загрузки",
    notFoundTitle: "Страница не найдена",
    description: "Что-то пошло не так. Попробуйте перезагрузить страницу.",
  },
  login: {
    retry: "Повторить",
    title: "Авторизация",
    continueWithProvider: "Продолжить с {{provider}}",
    authFailed: "Не удалось завершить авторизацию AniList. Попробуйте ещё раз.",
    description: "На данной странице вы сможете авторизоваться на нашем сайте.",
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
  ui: {
    watchStatus: {
      dropped: "Брошено",
      paused: "Отложено",
      watching: "Смотрю",
      completed: "Просмотрено",
      planned: "Запланировано",
    },
    filters: {
      close: "Назад",
      open: "Фильтры",
      format: "Формат",
      status: "Статус",
      adult: "Взрослое",
      save: "Сохранить",
      include: "Включить",
      exclude: "Исключить",
      default: "По умолчанию",
      source: "Первоисточник",
      resetAll: "Сбросить всё",
      ageRating: "Возрастной рейтинг",
      applied_one: "ui.filters.applied",
      applied_few: "ui.filters.applied",
      applied_many: "ui.filters.applied",
      applied_other: "ui.filters.applied",
    },
  },
} as const;
