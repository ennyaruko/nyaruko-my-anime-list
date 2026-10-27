/** Количество миллисекунд в минуте. */
const MINUTE_MS = 60 * 1_000;
/** Количество миллисекунд в часе. */
const HOUR_MS = 60 * MINUTE_MS;
/** Количество миллисекунд в сутках. */
const DAY_MS = 24 * HOUR_MS;

/** Допустимые виды справочных данных, для которых существуют query keys. */
export const referenceDataKinds = [
  "genres",
  "formats",
  "statuses",
  "seasons",
] as const;

/** Тип значения, которое передаётся в фабрику query key справочника. */
export type ReferenceDataKind = (typeof referenceDataKinds)[number];

/** Дополнительные параметры, влияющие на результат пользовательского списка. */
export type UserListParameters = Readonly<
  Record<string, null | string | number | boolean>
>;

/**
 * Условие для проверки одного элемента query key.
 *
 * `index` — позиция элемента, начиная с нуля. Например, в ключе
 * `['anime', 'details', 42]` значение `42` находится на позиции `2`.
 */
export type QueryKeyConstraint =
  | {
      /** Позиция проверяемого элемента в query key, начиная с нуля. */
      readonly index: number;
      /** Значение элемента должно совпасть с одним из значений этого списка. */
      readonly oneOf: readonly unknown[];
    }
  | {
      /** Позиция проверяемого элемента в query key, начиная с нуля. */
      readonly index: number;
      /**
       * `finite-number` принимает только конечное число;
       * `non-empty-string` — непустую строку после удаления пробелов по краям.
       */
      readonly type: "finite-number" | "non-empty-string";
    };

/** Настройки кеша, которые задаются рядом с фабрикой семейства запросов. */
type QueryFamilySettings = {
  /**
   * Сколько миллисекунд успешный результат считается свежим.
   * Если не задано, используется общее значение `defaultStaleTimeMs`.
   */
  readonly staleTimeMs?: number;
  /**
   * Позиция стабильного ID пользователя, если запрос от него зависит.
   * Query cleanup при logout использует это поле, а не проверяет имя префикса.
   */
  readonly userIdIndex?: number;
  /**
   * Сколько миллисекунд после последнего успешного обновления данные можно
   * хранить в IndexedDB. Отсутствие значения означает, что данные не
   * сохраняются между запусками приложения.
   */
  readonly persistForMs?: number;
  /** Дополнительные проверки элементов query key после его префикса. */
  readonly keyConstraints?: readonly QueryKeyConstraint[];
};

/**
 * Описывает одно семейство запросов: как строить его ключ и как кешировать
 * данные этого семейства. Это единственное место, где задаются обе части.
 */
function defineQueryFamily<
  const Prefix extends readonly unknown[],
  Arguments extends readonly unknown[],
  const Suffix extends readonly unknown[],
>(
  keyPrefix: Prefix,
  createKeySuffix: (...args: Arguments) => Suffix,
  settings: QueryFamilySettings = {},
) {
  return {
    /** Префикс добавляется в начало каждого ключа этого семейства. */
    keyPrefix,
    /** Свежесть результата; `undefined` означает общее значение по умолчанию. */
    staleTimeMs: settings.staleTimeMs,
    /** ID пользователя для очистки пользовательских запросов при logout. */
    userIdIndex: settings.userIdIndex,
    /** Срок хранения в IndexedDB; `undefined` означает без persistence. */
    persistForMs: settings.persistForMs,
    /** Все условия должны совпасть, чтобы политика применилась к ключу. */
    keyConstraints: settings.keyConstraints ?? [],
    /** Создаёт полный ключ из префикса семейства и переданных параметров. */
    key: (...args: Arguments) =>
      [...keyPrefix, ...createKeySuffix(...args)] as const,
  };
}

/**
 * Общие параметры кеша QueryClient и декларации семейств запросов.
 * Фабрика ключа и относящиеся к нему cache-настройки хранятся в одном поле
 * `families`. Поэтому запрос использует фабрику из этой записи, а resolver
 * находит настройки по префиксу, который та же запись добавляет в ключ.
 */
type QueryCacheConfiguration = {
  /**
   * Если `true`, при подключении компонента запрос обновит данные, когда они
   * устарели. Свежие данные повторно запрашиваться не будут.
   */
  readonly refetchOnMount: boolean;
  /**
   * Свежесть по умолчанию в миллисекундах. Используется, если семейство не
   * задаёт собственный `staleTimeMs`.
   */
  readonly defaultStaleTimeMs: number;
  /** Если `true`, устаревшие данные обновляются при возвращении фокуса в окно. */
  readonly refetchOnWindowFocus: boolean;
  /** Семейства ключей, каждое содержит и фабрику ключа, и его cache-политику. */
  readonly families: Readonly<
    Record<
      string,
      {
        readonly keyPrefix: readonly unknown[];
        readonly staleTimeMs: number | undefined;
        readonly userIdIndex: number | undefined;
        readonly persistForMs: number | undefined;
        readonly keyConstraints: readonly QueryKeyConstraint[];
      }
    >
  >;
  /** Настройки единого сохранённого snapshot QueryClient. */
  readonly snapshot: {
    /**
     * Идентификатор совместимости snapshot. TanStack отбрасывает snapshot,
     * сохранённый с другим значением. Менять его следует, только если нужно
     * намеренно перестать восстанавливать текущий кеш; миграции это поле
     * не выполняет.
     */
    readonly buster: string;
    /**
     * Максимальный возраст всего snapshot в миллисекундах, а не отдельного
     * запроса. Возраст данных каждого семейства независимо ограничивается
     * через `persistForMs`.
     */
    readonly maxAgeMs: number;
  };
};

/**
 * Единая конфигурация кеша запросов приложения.
 *
 * В `families` каждая запись одновременно определяет фабрику ключа (`key`),
 * правило его распознавания (`keyPrefix` и `keyConstraints`), принадлежность
 * пользовательским данным (`userIdIndex`) и cache-политику (`staleTimeMs`,
 * `persistForMs`). QueryClient, IndexedDB persister и очистка при logout читают
 * настройки из этой же записи — отдельного списка правил для тех же ключей нет.
 * Префикс и ограничения семейства должны распознавать ключ однозначно. Если
 * ключ совпадёт сразу с несколькими семействами, resolver завершится ошибкой:
 * неоднозначная политика не должна незаметно применяться к кешу.
 *
 * `staleTimeMs` отвечает за свежесть и автоматическую сетевую проверку;
 * `persistForMs` — за срок хранения успешных данных в IndexedDB. Чтение из
 * IndexedDB не обновляет время последнего успешного запроса. Если у семейства
 * не задан `persistForMs`, его данные не сохраняются между запусками. Если
 * ключ не совпал ни с одним семейством, используется `defaultStaleTimeMs`, а
 * данные не сохраняются в IndexedDB.
 *
 * Например, `families.userList.key('123', { format: 'ANIME' })` создаёт
 * `['user-list', '123', { format: 'ANIME' }]`. Resolver проверяет этот ключ
 * теми же `keyPrefix` и `keyConstraints` из `userList`, затем возвращает
 * заданные там свежесть и срок хранения.
 *
 * Чтобы добавить семейство, добавьте запись в `families`: укажите общий
 * префикс, функцию для оставшихся элементов ключа и настройки кеша. Не
 * добавляйте отдельную фабрику или правило в другом файле. Если семейство
 * зависит от пользователя, задайте `userIdIndex` — logout использует его для
 * поиска и очистки соответствующих запросов.
 */
export const queryCacheConfig = {
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  defaultStaleTimeMs: 5 * MINUTE_MS,
  snapshot: {
    maxAgeMs: 24 * DAY_MS,
    buster: "my-anime-list-v3",
  },
  families: {
    /** Search results are deliberately excluded from IndexedDB persistence. */
    mediaSearch: defineQueryFamily(
      ["media-search"],
      (parameters: object) => [parameters] as const,
    ),
    /** Фильтры считаются свежими 90 дней. */
    filters: defineQueryFamily(
      ["filters"],
      (userId: string) => [userId] as const,
      {
        userIdIndex: 1,
        staleTimeMs: 90 * DAY_MS,
        persistForMs: 90 * DAY_MS,
        keyConstraints: [{ index: 1, type: "non-empty-string" }],
      },
    ),
    /** Media reviews are fetched on demand and are not persisted. */
    mediaReviews: defineQueryFamily(
      ["media-reviews"],
      (userId: string, mediaId: number) => [userId, mediaId] as const,
      {
        userIdIndex: 1,
        keyConstraints: [
          { index: 1, type: "non-empty-string" },
          { index: 2, type: "finite-number" },
        ],
      },
    ),
    /** Related media are fetched on demand and are not persisted. */
    mediaRelations: defineQueryFamily(
      ["media-relations"],
      (userId: string, mediaId: number) => [userId, mediaId] as const,
      {
        userIdIndex: 1,
        keyConstraints: [
          { index: 1, type: "non-empty-string" },
          { index: 2, type: "finite-number" },
        ],
      },
    ),
    /** Recommendations load by page and are not persisted. */
    mediaRecommendations: defineQueryFamily(
      ["media-recommendations"],
      (userId: string, mediaId: number) => [userId, mediaId] as const,
      {
        userIdIndex: 1,
        keyConstraints: [
          { index: 1, type: "non-empty-string" },
          { index: 2, type: "finite-number" },
        ],
      },
    ),
    /** Список пользователя: свежесть 24 часа, хранение до 90 дней. */
    userList: defineQueryFamily(
      ["user-list"],
      (userId: string, parameters?: UserListParameters) =>
        [userId, parameters] as const,
      {
        userIdIndex: 1,
        staleTimeMs: 24 * HOUR_MS,
        persistForMs: 90 * DAY_MS,
        keyConstraints: [{ index: 1, type: "non-empty-string" }],
      },
    ),
    /** User-scoped media details: fresh and persisted for 24 hours. */
    mediaDetail: defineQueryFamily(
      ["media-detail"],
      (userId: string, mediaId: number) => [userId, mediaId] as const,
      {
        userIdIndex: 1,
        staleTimeMs: DAY_MS,
        persistForMs: DAY_MS,
        keyConstraints: [
          { index: 1, type: "non-empty-string" },
          { index: 2, type: "finite-number" },
        ],
      },
    ),
    /** Профиль привязан к OAuth-сессии: свежесть 24 часа, хранение до 90 дней. */
    account: defineQueryFamily(
      ["identity", "account"],
      (providerId: string, sessionId: null | string) =>
        [providerId, sessionId] as const,
      {
        staleTimeMs: 24 * HOUR_MS,
        persistForMs: 90 * DAY_MS,
        keyConstraints: [
          { index: 2, type: "non-empty-string" },
          { index: 3, type: "non-empty-string" },
        ],
      },
    ),
  },
} as const satisfies QueryCacheConfiguration;
