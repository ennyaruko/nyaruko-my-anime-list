---
status: accepted
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# ADR-005: Client-Side Persistent Storage for Query Cache

## Context and Problem Statement

ADR-004 определяет persisted query cache как часть server-state strategy MVP. Приложение должно восстанавливать ранее загруженный user list, filter/reference data и просмотренные anime details между сессиями, чтобы первый экран не зависел от network latency.

Необходимо выбрать конкретный browser storage и persistence mechanism. Решение должно подходить для structured query data, не превращать browser storage в отдельную application database, позволять контролировать набор persisted queries и retention, обеспечивать user isolation и оставлять техническую основу для post-MVP offline mode.

При этом MVP не должен добавлять Service Worker только ради persistence и не должен сохранять OAuth access token как часть persisted query cache.

## Decision Drivers

- Поддержка persistent structured data между browser sessions.
- Асинхронная работа с storage, чтобы persistence не блокировала UI.
- Подходящая модель для потенциально растущего query cache.
- Возможность использовать TanStack Query Persister contract.
- Возможность selective persistence.
- Возможность контролировать retention и выполнять cleanup.
- Возможность cache versioning/busting после несовместимых изменений приложения.
- Возможность очищать user-specific persisted state при logout/user switch.
- Возможность использовать то же storage foundation для post-MVP offline mode.
- Отсутствие необходимости вводить Service Worker для persistence.
- Отделение auth/token lifecycle от query persistence.
- Минимальная сложность MVP.

## Considered Options

### Option A — `localStorage` / Web Storage

Persisted QueryClient хранится в Web Storage через TanStack Query persister.

### Option B — IndexedDB with TanStack Query Persister

Query cache сохраняется в IndexedDB через persister, реализующий официальный TanStack Query `Persister` contract.

TanStack Query прямо документирует пример IndexedDB persister и отмечает преимущества IndexedDB перед Web Storage для такого persistence сценария. urlTanStack Query — persistQueryClient / IndexedDB persister

### Option C — Service Worker Cache API

API/network responses сохраняются в Cache API через Service Worker.

### Option D — Custom Application Database Abstraction

Приложение создаёт собственный database/storage abstraction поверх browser storage и самостоятельно определяет весь persistence lifecycle. TanStack Query становится только consumer этого слоя.

## Decision Outcome

Выбран **Option B — IndexedDB with TanStack Query Persister**.

IndexedDB является persistent storage для persisted query cache MVP. TanStack Query остаётся владельцем query lifecycle, а IndexedDB является storage backend и не становится вторым application-level cache owner.

```text
UI / Router
      ↓
TanStack Query / QueryClient
      ├── in-memory QueryCache
      ├── freshness / revalidation
      ├── invalidation
      └── persistence integration
                    ↓
             IndexedDB Persister
                    ↓
              Browser Storage
```

## Why IndexedDB

IndexedDB является browser database API для persistent structured data. Он работает асинхронно и предназначен для хранения структурированных объектов в browser storage.

Актуальная документация TanStack Query содержит официальный пример custom IndexedDB persister через `Persister` interface. В этом примере persisted client записывается и восстанавливается непосредственно из IndexedDB. TanStack также отмечает, что по сравнению с Web Storage IndexedDB быстрее для этого сценария, не ограничивается тем же порогом 5 MB и не требует превращать persisted client в одну JSON string representation.

Это соответствует нашему use case лучше, чем localStorage, потому что query cache является structured data и потенциально растущим набором записей.

## Why Not localStorage

`localStorage` технически способен хранить persisted QueryClient, и TanStack Query предоставляет соответствующий persister.

Однако для нашего use case он не является предпочтительным:

- Web Storage API синхронный;
- стандартный storage ориентирован на string values;
- для растущего structured query cache модель одного большого serialized snapshot менее удобна;
- ограниченный объём Web Storage хуже соответствует долгоживущему набору anime details и reference data;
- localStorage не даёт преимущества, ради которого стоило бы принимать эти ограничения.

Поэтому localStorage допускается как fallback/development option, но не является production storage decision MVP.

## Why Not Service Worker Cache API

Cache API хорошо подходит для network/resource caching и offline app shell, но не должна становиться владельцем application-level query state.

Если Service Worker будет добавлен post-MVP, его ответственность может включать:

- static assets;
- app shell;
- offline startup;
- отдельные network caching scenarios.

Structured query data при этом продолжает принадлежать TanStack Query и сохраняться в IndexedDB.

Таким образом ownership остаётся явным:

- **TanStack Query** — application server-state lifecycle;
- **IndexedDB** — persistence;
- **Service Worker** — возможный post-MVP app-shell/network layer.

## Why Not a Custom Application Database

Создание собственной database abstraction поверх IndexedDB дало бы дополнительный контроль, но для MVP преждевременно.

Основная задача уже решается комбинацией TanStack Query + Persister + IndexedDB. Собственный database layer увеличил бы количество API, тестов и lifecycle rules без отдельного MVP requirement.

Собственная abstraction может появиться позже, если application data перестанет быть преимущественно query-oriented server-state и появится самостоятельная client-side domain database.

## Persistence Policy

Выбор IndexedDB не означает, что весь QueryCache должен храниться бессрочно. ADR-004 требует selective persistence и category-aware retention.

### Persist in MVP

| Query category                | Persist          | Initial policy           |
| ----------------------------- | ---------------- | ------------------------ |
| User list                     | Да               | Persistent, user-scoped  |
| Filter/reference data         | Да               | Long retention           |
| Viewed anime details          | Да               | Medium retention         |
| Search results                | Нет по умолчанию | In-memory only           |
| Arbitrary exploratory queries | Нет              | In-memory only           |
| OAuth access token / secret   | Нет              | Отдельный auth lifecycle |

Конкретные numeric TTL значения не являются частью architectural decision и будут выбраны при реализации после измерения размера cache, частоты запросов и фактического UX.

Главное требование — retention должна быть **category-aware**.

## Query Keys and User Isolation

Все variables, влияющие на результат query, должны входить в query key.

Для user-specific data query key должен включать стабильный user identifier, например:

```text
['user-list', anilistUserId, listParameters]
```

Для public/catalog data user identifier в key не нужен.

При logout:

1. user-specific queries удаляются из QueryClient;
2. persisted user-specific data удаляется либо исключается из следующего persisted snapshot;
3. auth token не сохраняется через query persistence;
4. новый пользователь не должен получить доступ к cache предыдущего пользователя.

Если в будущем приложение будет поддерживать несколько аккаунтов на одном устройстве, user-scoped persistence может быть расширена отдельными storage namespaces. Это не является MVP requirement.

## Retention and Eviction

Persistence lifetime и query freshness должны оставаться разными понятиями.

```text
staleTime
  ↓
Когда data считается stale?

background revalidation
  ↓
Когда проверяем provider?

gcTime
  ↓
Когда inactive query удаляется из RAM?

persistent retention
  ↓
Когда persisted data удаляется из IndexedDB?
```

`gcTime` не должен использоваться как единственный механизм eviction persisted data.

Для стандартного `persistQueryClient` persisted state имеет `maxAge`, а `gcTime` должен быть не меньше `maxAge` для корректной hydration behavior. При этом `maxAge` относится к persisted client snapshot, а не является универсальной per-query retention policy.

Поэтому MVP persistence implementation должна использовать две границы:

1. **Snapshot-level safety limit** — `maxAge` для persisted snapshot.
2. **Query-level retention policy** — отбор query при dehydration/persistence по category и возрасту данных.

TanStack Query предоставляет `dehydrateOptions` и `shouldDehydrateQuery`, позволяющие управлять тем, какие queries попадают в dehydrated state.

### Retention Rule

> **Открытие приложения или обновление другой query не должно само по себе продлевать lifetime старой query.**

Для query-level retention ориентиром является время последнего успешного получения/обновления данных (`dataUpdatedAt`) и category policy.

Это особенно важно для anime details: пользователь мог открыть десятки карточек за месяцы, но приложение не должно хранить их бесконечно только из-за регулярного запуска.

## Selective Persistence Implementation

Для стабильного MVP foundation используется stable `persistQueryClient`/Persister contract, а не experimental per-query persister.

Selective persistence реализуется через dehydration policy:

```text
QueryCache
    ↓
select successful + allowed query categories
    ↓
apply category retention
    ↓
dehydrate
    ↓
IndexedDB
```

При этом:

- query с ошибкой не является persisted source of truth;
- search results не попадают в persisted state без отдельной policy;
- user-specific data проверяется на user scope;
- expired entries не должны попадать в новый persisted snapshot;
- cache buster/version позволяет принудительно инвалидировать persisted data после несовместимых изменений schema.

TanStack Query поддерживает `buster` для принудительного удаления persisted cache, если версия/buster persisted state не совпадает с текущим приложением.

## Bootstrap and Restore

Persistence restore является asynchronous operation.

Для React application предпочтительно использовать `PersistQueryClientProvider`, чтобы query fetching не начал конкурировать с asynchronous restore.

Ожидаемая последовательность:

```text
Application start
      ↓
Create QueryClient
      ↓
Restore persisted state
      ↓
Apply snapshot/version/retention rules
      ↓
Application becomes ready
      ↓
Fresh data → render immediately
Stale data  → render + background revalidation
Missing data → fetch + loading
```

Официальная документация TanStack Query указывает, что `PersistQueryClientProvider` предотвращает race между restore и mounting/fetching queries; после восстановления stale queries могут refetch-иться, а fresh queries могут использовать restored data без лишнего запроса.

## Storage Errors

Persistence failure не должна делать приложение полностью неработоспособным.

Если IndexedDB недоступна, повреждена или persistence operation завершилась ошибкой:

- application-level query fetching должен продолжать работать in-memory;
- user должен иметь возможность использовать online MVP;
- persistence error может быть диагностирована/залогирована локально;
- приложение не должно считать отсутствие persistence равным отсутствию AniList data.

Это сохраняет правильную иерархию зависимостей: persistence ускоряет и сохраняет state, но не является единственным источником данных для online MVP.

## Offline Foundation, but Not Offline Mode

Offline mode **не входит в MVP**.

Однако IndexedDB persistence создаёт техническую основу для будущего режима:

```text
Post-MVP

Service Worker / App Shell
          ↓
Application starts without network
          ↓
TanStack Query restores cached state
          ↓
Cached data available → show
Missing data → unavailable state
          ↓
Network returns → revalidation / synchronization
```

В будущем может быть добавлена соответствующая network policy, например `offlineFirst`, и отдельный UI для offline state. Это не считается частью ADR-005 MVP decision.

Актуальная документация TanStack Query также описывает experimental per-query persister, который способен lazy-restore queries и имеет per-query `maxAge`, но этот API явно помечен как experimental. Он не выбран как foundation MVP.

## SSR / BFF Compatibility

IndexedDB является browser-side persistence mechanism и не должен проникать в application/domain contracts.

При будущей SSR/BFF migration:

- server-side QueryClient может использовать dehydration/hydration;
- browser QueryClient продолжит использовать IndexedDB persistence;
- persistence implementation останется infrastructure concern;
- application/domain model из ADR-002 не меняется.

Таким образом, ADR-005 не блокирует SSR/BFF evolution из ADR-001.

## Security and Privacy

Persisted query cache может содержать provider data, включая user-specific list и ранее просмотренные anime details.

Поэтому:

- OAuth access token не хранится в query persistence;
- user-specific query data очищается при logout;
- application не должна рассматривать IndexedDB как secure secret store;
- данные, сохранённые в browser, находятся под контролем соответствующего browser origin и его security model;
- persisted cache не должен использоваться как механизм авторизации.

Это не устраняет общий client-side OAuth risk, уже принятый ADR-001, но не добавляет token persistence поверх query cache.

## Consequences

### Positive

- Поддерживается persistent structured query cache между сессиями.
- Storage подходит для потенциально растущего набора structured data.
- Persistence не требует Service Worker.
- TanStack Query остаётся единым cache owner.
- Возможна selective persistence.
- Возможна category-aware retention.
- Возможен cache versioning/busting.
- User-specific data может быть изолирована через query keys и logout cleanup.
- Storage foundation подходит для будущего offline mode.
- Browser storage остаётся infrastructure concern и не проникает в domain/application model.

### Negative / Accepted Trade-offs

- Требуется custom IndexedDB persister implementation или библиотека вокруг IndexedDB.
- Необходимо реализовать persistence cleanup/retention policy поверх базового persister lifecycle.
- Нужно тестировать browser storage errors и migration/buster behavior.
- IndexedDB не является secure secret storage.
- Offline mode не появляется автоматически только потому, что данные persisted.
- Для SSR server runtime IndexedDB недоступна, поэтому persistence implementation должна оставаться browser-specific.

## Pros and Cons of the Options

### Option A — localStorage / Web Storage

- Good, because очень простой browser API.
- Good, because TanStack Query имеет готовый sync storage persister.
- Good, because может быть достаточен для маленького cache.
- Bad, because synchronous I/O хуже подходит для растущего cache.
- Bad, because Web Storage ориентирован на string values.
- Bad, because ограниченный объём менее удобен для долгоживущего anime query cache.
- Bad, because большой serialized snapshot становится менее удобным для дальнейшего offline-oriented evolution.

### Option B — IndexedDB with TanStack Query Persister

- Good, because подходит для structured persistent browser data.
- Good, because поддерживает asynchronous access.
- Good, because TanStack Query документирует custom IndexedDB persister.
- Good, because хорошо подходит как foundation для future offline feature.
- Good, because storage ownership остаётся отделённым от QueryCache lifecycle.
- Bad, because требует более сложной integration, чем localStorage.
- Bad, because retention, cleanup и migration policy необходимо определить явно.

### Option C — Service Worker Cache API

- Good, because хорошо подходит для app shell, static resources и network caching.
- Good, because полезен для post-MVP offline startup.
- Bad, because Cache API не является естественной заменой structured query persistence.
- Bad, because создаёт второй data ownership layer при одновременном использовании QueryCache.
- Bad, because authenticated AniList API caching требует отдельной сложной policy.

### Option D — Custom Application Database Abstraction

- Good, because даёт полный контроль над storage schema и lifecycle.
- Good, because может стать полезным при появлении самостоятельной client-side domain database.
- Bad, because для текущего MVP это преждевременная abstraction.
- Bad, because дублирует часть persistence responsibilities, уже доступных через TanStack Query.
- Bad, because увеличивает implementation and maintenance cost.

## Validation

### 1. Browser Storage Fit

**Result: PASS.**

IndexedDB соответствует потребности в persistent structured browser data и является подходящим storage backend для query persistence.

### 2. TanStack Query Persister Compatibility

**Result: PASS.**

Актуальная документация TanStack Query определяет `Persister` interface и прямо приводит IndexedDB implementation. Это позволяет сохранить QueryClient lifecycle в TanStack Query, а storage implementation — в infrastructure layer.

### 3. Selective Persistence

**Result: PASS with implementation policy.**

TanStack Query dehydration поддерживает `shouldDehydrateQuery`, поэтому application может определить, какие successful queries должны попадать в persisted state. Это позволяет исключить search results и другие high-cardinality query categories.

### 4. Cache Versioning

**Result: PASS.**

Persisted cache может быть forcefully invalidated через `buster`, что позволяет безопасно сбрасывать несовместимые persisted state после schema/application changes.

### 5. Restore Lifecycle

**Result: PASS.**

`PersistQueryClientProvider` предназначен для asynchronous restore и предотвращения race condition между hydration и query fetching.

### 6. Experimental Per-Query Persister

**Result: NOT SELECTED.**

`experimental_createQueryPersister` предоставляет attractive per-query persistence, lazy restore и per-query `maxAge`, однако текущая документация помечает API как experimental. Поэтому MVP не делает его обязательной dependency.

### 7. Offline Mode

**Result: POST-MVP.**

Наличие IndexedDB persistence не означает, что offline mode реализован. Offline UX, Service Worker/app shell и offline synchronization будут отдельным post-MVP decision.

## Confirmation

Решение считается корректно реализованным, если:

- persisted query data хранится в IndexedDB;
- QueryClient остаётся владельцем query lifecycle;
- используется TanStack Query Persister contract;
- persistence не блокирует application runtime при временной storage failure;
- persisted query scope является selective;
- user list, filter/reference data и viewed anime details могут восстанавливаться между сессиями;
- search results не persist-ятся без отдельного bounded decision;
- OAuth access token не сохраняется в query persistence;
- user-specific cache очищается при logout/user switch;
- persisted state имеет version/buster mechanism;
- retention policy учитывает query category и возраст data;
- Service Worker не используется как второй AniList application-data cache в MVP;
- post-MVP offline mode может быть добавлен без изменения application/domain contracts.

## Revisit Conditions

ADR-005 следует пересмотреть, если:

- размер/характер client-side data перестанет соответствовать query-oriented persistence;
- появится необходимость в полноценной client-side domain database;
- browser storage limitations станут критичными для MVP;
- persistence requirements потребуют более сложной multi-user/multi-account model;
- offline mode станет MVP requirement и потребует другого storage/synchronization design;
- TanStack Query persistence API существенно изменит текущий supported contract.

## More Information

Связанные документы:

- [BRD](../[BRD]%20-%20Phase%20MVP.md): Phase MVP
- [SAD](../[SAD]%20-%20Solution%20Architecture%20Document.md): Solution Architecture Document
- [ADR-001](./[ADR-001]%20-%20Client-Side%20Architecture%20for%20MVP.md): Client-Side Architecture for MVP
- [ADR-002](./[ADR-002]%20-%20Provider-agnostic-application-model.md): Provider-Agnostic Application Model
- [ADR-003](./[ADR-003]%20-%20Anilist-as-the-mvp-data-provider.md): AniList as the MVP Data Provider
- [ADR-004](./[ADR-004]%20-%20Server-State-Cache-Persistence-and-Revalidation-Strategy.md): Server-State Cache, Persistence and Revalidation Strategy

External validation:

- https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient
- https://tanstack.com/query/latest/docs/framework/react/reference/functions/dehydrate
- https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
