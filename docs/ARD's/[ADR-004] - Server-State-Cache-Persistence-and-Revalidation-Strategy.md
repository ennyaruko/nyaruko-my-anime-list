---
status: accepted
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# ADR-004: Server-State Cache, Persistence and Revalidation Strategy

## Context and Problem Statement

На этапе MVP Anime Tracker внешний server-state поступает из AniList согласно ADR-003. Архитектура остаётся client-first согласно ADR-001, а application/domain model отделена от provider-specific DTO согласно ADR-002.

При этом пользовательский сценарий требует не просто временного in-memory cache, а согласованного жизненного цикла данных между сессиями:

1. При первом входе пользователь должен увидеть skeleton для критического пользовательского списка, пока данные загружаются. Данные, необходимые для фильтров, должны после критического render загружаться в фоне.
2. При повторном входе в тот же день ранее загруженный список, данные фильтров и просмотренные карточки аниме должны быть восстановлены из persistent cache и показаны без обязательного ожидания сети.
3. На следующий день cached data должна быть показана сразу, после чего при наличии сети должна выполняться background revalidation. Свежие данные должны заменить устаревшие после успешного ответа provider.
4. Manual refresh является отдельным пользовательским действием. Пользователь явно просит получить актуальные данные и должен видеть отдельное состояние refresh/loading, а не обычный stale-while-revalidate UX.
5. Cache не должен расти бесконтрольно. Freshness и retention должны быть разными политиками. Давно неиспользуемая query не должна получать новый срок хранения только потому, что приложение было открыто или был обновлён другой query.
6. Полноценный offline mode не входит в MVP. Однако persistence/data layer должен быть построен так, чтобы post-MVP offline mode можно было добавить без замены основной модели server-state.

Таким образом, необходимо определить, подходит ли TanStack Query как единый application-level механизм server-state cache, persistence integration, prefetching и revalidation, а также какую роль должен играть Service Worker.

## Decision Drivers

- Немедленное отображение ранее загруженных данных между сессиями.
- Поддержка модели **cached data first → background revalidation** для stale data.
- Отдельное и предсказуемое поведение explicit manual refresh.
- Возможность background prefetch небольших datasets, которые с высокой вероятностью понадобятся пользователю.
- Снижение количества повторных запросов к AniList и влияния API rate limits.
- Выполнение NFR-05: p95 получения/отображения данных ≤ 800 ms при наличии данных в client cache.
- Контролируемый рост cache и возможность category-aware retention policy.
- Один владелец application-level server-state cache вместо конкурирующих cache layers.
- Совместимость со static hosting и client-first архитектурой ADR-001.
- Совместимость с provider boundary из ADR-002 и AniList integration из ADR-003.
- Возможность будущей эволюции к SSR/BFF без замены application-level server-state model.
- Возможность добавить полноценный offline mode после MVP без переписывания query/data layer.
- Минимальная архитектурная сложность MVP.

## Considered Options

### Option A — TanStack Query In-Memory Cache Only

TanStack Query является application-level cache только в рамках текущего жизненного цикла QueryClient. Freshness управляется через `staleTime`, а refetch/invalidation — средствами TanStack Query.

После полной перезагрузки страницы или новой browser session ранее загруженные query data отсутствуют и должны быть получены заново.

### Option B — TanStack Query + Persisted Query Cache

TanStack Query остаётся единственным владельцем application-level server-state cache, а выбранные query data дополнительно сохраняются между сессиями через persistence mechanism.

Concrete storage backend не определяется этим ADR и принимается отдельно в ADR-005.

Модель разделяет следующие ответственности:

- **Freshness (`staleTime`)** — считается ли data свежей для автоматического использования без network request.
- **In-memory retention (`gcTime`)** — сколько inactive query может оставаться в памяти QueryClient.
- **Persistent retention** — как долго конкретная категория данных может храниться между сессиями.
- **Revalidation** — когда stale data проверяется у provider.
- **Invalidation** — как mutation или другое известное изменение помечает связанные queries stale.
- **Prefetch** — как заранее получить данные, которые вероятно понадобятся пользователю.

### Option C — Service Worker / Cache API as Application Data Cache

Service Worker перехватывает API requests и хранит responses в Cache API, одновременно с QueryCache TanStack Query.

В результате один и тот же application data flow получает два cache owners: application cache и network cache.

### Option D — Custom Server-State Cache Separate from TanStack Query

Приложение реализует собственный cache/store, собственные правила freshness/revalidation и собственный persistence lifecycle.

TanStack Query либо не используется, либо используется только частично как UI/data-fetching integration.

## Decision Outcome

Выбран **Option B — TanStack Query + Persisted Query Cache**.

TanStack Query принимается как **единый application-level владелец server-state cache** для MVP. Persistence является частью стратегии server-state, но concrete browser storage и способ его подключения определяются ADR-005.

Это разделяет два решения:

- **ADR-004:** что происходит с server-state в течение его lifecycle;
- **ADR-005:** где и каким browser storage persisted state сохраняется.

Service Worker не используется в MVP как второй cache для AniList application data.

## Core Runtime Model

```text
UI / Router
      ↓
TanStack Query / QueryClient
      ├── fresh cache → render immediately
      ├── stale cache → render immediately + background revalidation
      ├── missing cache → loading/skeleton + fetch
      ├── prefetch → populate cache before user opens a feature
      └── explicit refresh → user-requested refetch/loading
                  ↓
            Provider Adapter
                  ↓
              AniList API

Persistent storage
      ↑
      │ persistence integration
      │
TanStack Query
```

Persistent storage является persistence layer для QueryCache и не должен становиться отдельным application-level cache owner.

## Scenario Rules

### 1. First Visit

Если критические данные отсутствуют:

1. UI показывает skeleton/loading для пользовательского списка.
2. TanStack Query выполняет query через Provider Adapter.
3. После успешного ответа data попадает в QueryCache.
4. Критический UI отображается.
5. После этого приложение может выполнить background prefetch filter/reference data.
6. Prefetch не должен превращаться в массовую загрузку каталога.

TanStack Query поддерживает prefetching как способ заранее заполнить cache. Если query уже имеет cached state, повторный prefetch не должен создавать лишний запрос.

### 2. Second Visit on the Same Day

Если persisted data восстановлена и query находится в пределах freshness policy:

1. UI использует cached data сразу.
2. Сам факт повторного входа не является причиной обязательного network request.
3. Если query stale, она может revalidate в фоне, не блокируя первоначальное отображение cached data.

### 3. Next-Day Visit

Если persisted data существует, но стала stale:

1. persisted cache восстанавливается;
2. cached data отображается сразу;
3. запускается background revalidation;
4. provider возвращает актуальную data;
5. QueryCache обновляется;
6. UI получает новое состояние.

Toast о наличии изменений не является обязательной частью ADR-004. Это UI/product behavior, которое может использовать результат revalidation и query state.

### 4. Manual Refresh

Manual refresh является отдельным UX-сценарием и не должен восприниматься как обычный background revalidation.

При явном действии пользователя приложение:

1. инициирует explicit refetch соответствующей query;
2. переводит UI в manual-refresh loading state;
3. при необходимости показывает skeleton/loading overlay согласно UX implementation;
4. ждёт завершения запроса;
5. отображает новый результат или ошибку.

При этом underlying TanStack Query cache lifecycle остаётся тем же. Разница заключается в UI policy и явном пользовательском intent.

### 5. Background Prefetch of Filters

После первичного критического render допускается prefetch небольших reference/filter datasets:

```text
App start
   ↓
Restore / fetch user list
   ↓
Render critical UI
   ↓
Background prefetch filter data
```

Prefetch должен быть ограничен данными, которые действительно необходимы для быстрого открытия фильтров. Он не должен автоматически загружать большие объёмы каталога.

### 6. Cache Growth and Retention

Freshness и retention не являются одним параметром.

- `staleTime` отвечает на вопрос: **«Можно ли считать data свежей и не делать автоматический запрос?»**
- `gcTime` отвечает на вопрос: **«Сколько inactive query остаётся в памяти QueryClient?»**
- persistent retention отвечает на вопрос: **«Как долго data разрешено хранить между сессиями?»**
- revalidation отвечает на вопрос: **«Когда проверить stale data у provider?»**

`gcTime` не является самостоятельной политикой lifetime persisted data. Для стандартного `persistQueryClient` также существует `maxAge` persisted snapshot, поэтому его нельзя трактовать как универсальный per-query TTL. При hydration TanStack Query рекомендует, чтобы `gcTime` был не меньше `maxAge`, иначе in-memory garbage collection может удалить восстановленный cache раньше ожидаемого.

Архитектурное правило MVP:

> **Открытие приложения само по себе не продлевает retention конкретной query. Lifetime должен определяться успешным обновлением самой query и/или retention policy её категории.**

Это особенно важно для anime details: давно неиспользуемая карточка не должна жить бесконечно только потому, что пользователь периодически открывает приложение.

### 7. Logout and User Switch

User-specific queries должны быть отделены от public/catalog queries через query keys, включающие идентификатор пользователя там, где результат зависит от пользователя.

При logout:

- user-specific QueryCache data должна быть очищена;
- persisted user-specific data также должна быть удалена или перестать быть доступной текущему anonymous session;
- OAuth access token не должен сохраняться как часть query persistence.

При смене пользователя cache предыдущего пользователя не должен отображаться новому пользователю.

## Persistence Scope

В MVP persistence является **selective**, а не обязательной для каждого query.

| Query category                | Persist in MVP   | Rationale                                                           |
| ----------------------------- | ---------------- | ------------------------------------------------------------------- |
| User list                     | Да               | Критический первый экран и быстрый возврат к состоянию пользователя |
| Filter/reference data         | Да               | Нужны сразу после открытия фильтров                                 |
| Viewed anime details          | Да               | Пользователь уже проявил интерес к данным                           |
| Search results                | Нет по умолчанию | Потенциально неограниченное количество query keys                   |
| Arbitrary exploratory queries | Нет              | Необоснованный рост persisted cache                                 |
| OAuth token / secret          | Нет              | Auth lifecycle отделён от query persistence                         |

Если позднее понадобится persistence search history/results, это должно быть отдельным bounded decision с ограничением количества записей, возраста или обоих параметров.

## Service Worker Boundary

Service Worker не является частью MVP server-state cache.

В post-MVP он может быть добавлен для:

- app shell;
- static assets;
- offline startup;
- network interception, если появится отдельное обоснованное требование.

Но AniList application data в MVP остаётся под управлением TanStack Query. Это предотвращает ситуацию, в которой Cache API и QueryCache одновременно решают freshness, invalidation и ownership одних и тех же данных.

## Offline Scope

Полноценный offline mode **не входит в MVP**.

Однако persistence architecture не должна ему препятствовать. В будущем можно добавить offline-first network policy и UI для состояний:

- offline mode activated;
- cached data available;
- requested data was never cached;
- mutation pending / synchronization required.

Это не требует менять application/domain contracts или переносить ownership server-state из TanStack Query.

## SSR / BFF Evolution

TanStack Query выбран не как привязка к конкретному способу deployment, а как application-level server-state abstraction.

В будущем при появлении SSR/BFF:

- provider integration может быть частично перенесена на server side;
- QueryClient может использовать hydration/dehydration;
- application/domain contracts из ADR-002 остаются прежними;
- client-side persistence может сохраниться для client-owned state.

Это соответствует общей client-first стратегии ADR-001 и не требует менять решение ADR-004 только из-за появления SSR/BFF.

## Consequences

### Positive

- Повторный вход может показывать ранее загруженные данные без ожидания сети.
- Stale data может использоваться для быстрого UI, пока выполняется background revalidation.
- Manual refresh имеет отдельный UX и не смешивается с автоматической revalidation.
- Prefetch фильтров поддерживается естественно.
- Один application-level cache owner уменьшает риск рассинхронизации нескольких cache layers.
- Persistence можно включить выборочно.
- Cache growth контролируется отдельной retention policy.
- Архитектура остаётся совместимой с client-first/static hosting.
- Persistence foundation может быть использован для post-MVP offline mode.
- Архитектура не блокирует будущую SSR/BFF evolution.

### Negative / Accepted Trade-offs

- Появляется необходимость явно определить `staleTime`, `gcTime` и persistent retention для разных категорий data.
- Persistence требует дополнительного storage/persister implementation, принятого в ADR-005.
- Необходимо аккуратно разделять user-specific и public query keys.
- Background prefetch увеличивает число запросов, поэтому его scope должен быть ограничен.
- Persisted cache может содержать устаревшие данные и не является источником истины: AniList остаётся external source of truth для provider data.
- Полноценный offline UX остаётся отдельной post-MVP feature.

## Pros and Cons of the Options

### Option A — TanStack Query In-Memory Cache Only

- Good, because минимальная implementation complexity.
- Good, because не требует browser persistence.
- Good, because хорошо соответствует базовому session cache.
- Bad, because не выполняет требование instant restore между browser sessions.
- Bad, because не поддерживает описанный next-day cached-first сценарий после полной перезагрузки.
- Bad, because не создаёт persistence foundation для будущего offline mode.

### Option B — TanStack Query + Persisted Query Cache

- Good, because соответствует всем основным описанным пользовательским сценариям.
- Good, because сохраняет единый owner server-state lifecycle.
- Good, because позволяет разделить freshness, revalidation и persistence.
- Good, because поддерживает selective persistence.
- Good, because хорошо сочетается с будущим offline mode.
- Good, because storage backend может быть изменён отдельно через ADR-005 без изменения server-state model.
- Bad, because появляется дополнительная persistence complexity.
- Bad, because retention policy необходимо проектировать явно.

### Option C — Service Worker / Cache API as Application Data Cache

- Good, because Service Worker/Cache API полезны для offline shell и network resource caching.
- Good, because может перехватывать network requests независимо от UI lifecycle.
- Bad, because создаёт второй cache owner для AniList data.
- Bad, because freshness/invalidation становятся сложнее.
- Bad, because user-specific authenticated API responses требуют особенно аккуратного cache policy.
- Bad, because Service Worker не нужен для решения основной MVP задачи persistence of structured query state.

### Option D — Custom Server-State Cache Separate from TanStack Query

- Good, because даёт полный контроль над lifecycle.
- Good, because можно реализовать любую специализированную retention model.
- Bad, because большая часть cache/revalidation/prefetch functionality уже предоставляется TanStack Query.
- Bad, because создаётся собственный infrastructure layer без текущего MVP требования.
- Bad, because увеличивает объём кода и тестирования.
- Bad, because повышает стоимость будущей поддержки.

## Validation

### 1. Fit for User Scenarios

**Result: PASS.**

TanStack Query предоставляет cache lifecycle, stale/fresh model, refetch/invalidation и prefetching, необходимые для описанных сценариев. Persisted cache закрывает межсессионный сценарий, который Option A не покрывает.

### 2. Persistence Integration

**Result: PASS.**

Актуальная документация TanStack Query определяет persister contract для сохранения QueryClient и позволяет реализовать storage backend отдельно. `PersistQueryClientProvider` предотвращает race condition между asynchronous restore и началом query fetching.

### 3. Prefetching

**Result: PASS.**

TanStack Query поддерживает prefetching для данных, которые предположительно понадобятся пользователю, и использует cache результата. `usePrefetchQuery` пропускает prefetch, если query уже имеет cached state.

### 4. Persistent Retention

**Result: PASS with implementation constraint.**

TanStack Query предоставляет persisted snapshot `maxAge`, cache buster и стандартный hydration lifecycle. Однако category-aware/per-query retention является application policy и не должна быть сведена к одному глобальному TTL.

Stable `persistQueryClient` позволяет управлять тем, какие queries попадают в dehydrated state через `dehydrateOptions`, а сама dehydration API поддерживает `shouldDehydrateQuery`.

### 5. Experimental Per-Query Persister

**Result: NOT SELECTED for the MVP foundation.**

Актуальный `experimental_createQueryPersister` умеет сохранять queries отдельно, лениво восстанавливать их и выполнять per-query `maxAge`, но сам API в документации помечен как experimental. Поэтому MVP не делает его обязательной architectural dependency.

### 6. Service Worker Boundary

**Result: PASS.**

Service Worker не требуется для описанных MVP cache/revalidation сценариев. Его применение оставлено для post-MVP offline/app-shell needs.

### 7. SSR / BFF Compatibility

**Result: PASS.**

TanStack Query имеет официальные hydration/dehydration механизмы для server rendering, поэтому выбранная application-level server-state model не противоречит будущей SSR/BFF evolution.

## Confirmation

Решение считается корректно реализованным, если:

- TanStack Query является единственным application-level owner server-state cache;
- persisted query cache используется для выбранных query categories;
- first visit показывает loading/skeleton только там, где данных действительно нет;
- filter/reference data может prefetch-иться после critical render;
- повторный вход может восстановить persisted data без обязательного network wait;
- stale restored data может быть показана до background revalidation;
- manual refresh имеет отдельный loading state и explicit refetch;
- search results не persist-ятся без отдельного bounded decision;
- user-specific query keys обеспечивают isolation;
- logout не оставляет user-specific persisted data доступными следующему пользователю;
- persistent retention не равна одному глобальному `staleTime`;
- Service Worker не является вторым AniList data cache в MVP;
- offline mode не считается реализованным только из-за наличия persistence;
- приложение сохраняет возможность последующей SSR/BFF evolution.

## Revisit Conditions

ADR-004 следует пересмотреть, если:

- TanStack Query перестанет покрывать реальные cache/revalidation requirements;
- появится обязательная server-side cache/aggregation architecture;
- появится необходимость использовать Service Worker как обязательный API cache;
- offline mode станет MVP requirement и потребует существенно иной synchronization model;
- retention requirements окажутся несовместимыми с выбранным persistence approach;
- provider integration будет перенесена на BFF таким образом, что server-state ownership существенно изменится.

## More Information

Связанные документы:

- [BRD](../[BRD]%20-%20Phase%20MVP.md): Phase MVP
- [SAD](../[SAD]%20-%20Solution%20Architecture%20Document.md): Solution Architecture Document
- [ADR-001](./[ADR-001]%20-%20Client-Side%20Architecture%20for%20MVP.md): Client-Side Architecture for MVP
- [ADR-002](./[ADR-002]%20-%20Provider-agnostic-application-model.md): Provider-Agnostic Application Model
- [ADR-003](./[ADR-003]%20-%20Anilist-as-the-mvp-data-provider.md): AniList as the MVP Data Provider
- [ADR-005](./[ADR-005]%20-%20Client-Side-Persistent-Storage.md): Client-Side Persistent Storage

External validation:

- https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient
- https://tanstack.com/query/latest/docs/framework/react/guides/prefetching
- https://tanstack.com/query/latest/docs/framework/react/reference/functions/usePrefetchQuery
- https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
