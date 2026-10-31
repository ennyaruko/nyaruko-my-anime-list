---
status: proposed
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# RFC-003: AniList as the MVP Data Provider

## 1. Context and Problem Statement

На этапе MVP Anime Tracker требуется внешний data provider для получения данных об аниме и для синхронизации пользовательского списка.

В текущей архитектуре AniList определён как единственный внешний provider MVP. SAD при этом отдельно фиксирует, что архитектура не должна зависеть от конкретного provider и должна позволять в будущем подключать дополнительные источники.

Это решение требует отдельной валидации: необходимо определить, достаточно ли AniList для требований MVP и следует ли использовать его как единственный provider на данном этапе, либо уже в MVP необходим альтернативный или дополнительный источник данных.

## 2. Problem Statement

Какой внешний data provider должен использовать Anime Tracker в MVP:

- AniList как единственный provider;
- другой внешний provider;
- или несколько providers одновременно?

Необходимо выбрать вариант, который обеспечивает требования MVP при минимально необходимой сложности и сохраняет возможность дальнейшего расширения архитектуры.

## 3. Decision Drivers

Основные критерии выбора:

1. Покрытие функциональных требований MVP.
2. Возможность поиска и получения карточек аниме.
3. Возможность работы с пользовательским списком.
4. Authentication и authorization для пользовательского списка.
5. Полнота и качество anime metadata.
6. Поддержка русскоязычного сценария приложения.
7. API capabilities и пригодность для client-side MVP.
8. Rate limits и другие ограничения API.
9. Надёжность и доступность provider.
10. Совместимость со static hosting и client-side architecture из ADR-001.
11. Сложность интеграции и эксплуатации.
12. Возможность дальнейшего добавления других providers через ADR-002.
13. Отсутствие необходимости реализовывать aggregation нескольких providers уже в MVP.

## 4. Considered Options

### Option A — AniList as the Sole MVP Provider

AniList является единственным external data provider в MVP.

Он предоставляет:

- anime metadata;
- search;
- anime details;
- user list data;
- операции над пользовательским списком;
- authentication через OAuth;
- GraphQL API.

Provider-specific implementation находится за Provider Integration boundary согласно ADR-002.

Flow:

```text
UI
 ↓
Application
 ↓
Provider Interface
 ↓
AniList Adapter
 ↓
AniList API
```

### Option B — Alternative Provider Instead of AniList

Для MVP выбирается другой внешний provider, а AniList не используется как основной источник.

В этом случае выбранный provider должен покрывать не только каталог и metadata, но и необходимые для MVP операции с пользовательским списком и authentication либо предоставлять эквивалентный механизм.

### Option C — Multiple Providers in MVP

MVP использует два или более external providers одновременно.

Providers могут использоваться для:

- объединения каталогов;
- дополнения отсутствующих данных;
- расширения контентного покрытия;
- fallback при недоступности одного provider.

В этом варианте application/provider integration должна дополнительно решать вопросы normalization, source precedence, conflict resolution, deduplication и aggregation.

## 5. Evaluation Criteria

| Criterion                     | Option A | Option B | Option C |
| ----------------------------- | -------- | -------- | -------- |
| Покрытие MVP requirements     | TBD      | TBD      | TBD      |
| Anime search/details          | TBD      | TBD      | TBD      |
| User list integration         | TBD      | TBD      | TBD      |
| Authentication                | TBD      | TBD      | TBD      |
| Metadata coverage             | TBD      | TBD      | TBD      |
| Client-side compatibility     | TBD      | TBD      | TBD      |
| API limitations / rate limits | TBD      | TBD      | TBD      |
| Integration complexity        | TBD      | TBD      | TBD      |
| Operational complexity        | TBD      | TBD      | TBD      |
| Need for aggregation          | TBD      | TBD      | TBD      |
| Compatibility with ADR-001    | TBD      | TBD      | TBD      |
| Compatibility with ADR-002    | TBD      | TBD      | TBD      |
| Future extensibility          | TBD      | TBD      | TBD      |

## 6. Trade-offs

### Option A — AniList as the Sole MVP Provider

Advantages:

- минимальная сложность provider integration;
- один источник данных;
- отсутствует необходимость aggregation и conflict resolution;
- один authentication flow для пользовательского списка;
- соответствует текущему SAD;
- соответствует текущей client-side архитектуре;
- позволяет реализовать MVP без преждевременной интеграции нескольких внешних систем;
- второй provider может быть добавлен позднее через Provider Adapter согласно ADR-002.

Disadvantages:

- каталог и metadata ограничены возможностями AniList;
- доступность и rate limits AniList становятся внешней зависимостью MVP;
- контент, отсутствующий в AniList, не будет доступен через другой provider;
- authentication пользовательского списка зависит от AniList.

### Option B — Alternative Provider Instead of AniList

Advantages:

- потенциально другое покрытие каталога;
- потенциально другие metadata и API capabilities;
- можно выбрать provider, который лучше соответствует конкретным требованиям.

Disadvantages:

- требует доказать, что альтернативный provider покрывает все обязательные MVP use cases;
- может потребоваться другой authentication flow;
- может отсутствовать эквивалентная функциональность пользовательского списка;
- потребует отдельной provider-specific интеграции;
- смена provider на этапе MVP не даёт очевидного преимущества, если текущие требования уже покрываются AniList.

### Option C — Multiple Providers in MVP

Advantages:

- более широкое покрытие каталога;
- возможность получать дополнительные данные из разных источников;
- возможность потенциального fallback;
- архитектурно сразу готовит aggregation сценарий.

Disadvantages:

- существенно увеличивает сложность MVP;
- требует normalization и mapping между providers;
- требует правил выбора источника истины;
- требует deduplication и conflict resolution;
- может потребовать provider-specific aggregation logic;
- усложняет caching и synchronization;
- увеличивает количество внешних API и потенциальных failure points;
- противоречит принципу минимальной сложности MVP, если aggregation не требуется функциональными требованиями.

## 7. Questions for Owner / Open Questions

1. Подтверждаем ли AniList как единственный provider для MVP?
2. Покрывает ли AniList все обязательные MVP use cases: search, details, user list и status changes?
3. Принимается ли ограничение каталога AniList как допустимое ограничение MVP?
4. Принимаются ли ограничения AniList API/rate limits как архитектурный риск MVP?
5. Требуется ли в MVP fallback provider при недоступности AniList?
6. Требуется ли в MVP объединение данных нескольких providers?
7. Нужно ли считать потенциальную интеграцию Shikimori и других источников исключительно post-MVP scope?
8. Должен ли AniList оставаться provider of record для пользовательского списка даже после появления дополнительных catalog providers?
9. Есть ли требования к provider, которых AniList принципиально не выполняет?
10. Следует ли отдельно зафиксировать условия, при которых ADR-003 должен быть пересмотрен?

## 8. Preliminary Validation Plan

Validation должна проверить:

- требования BRD против возможностей AniList;
- search и anime details;
- user list read/write;
- status changes;
- authentication;
- GraphQL/client-side usage;
- API rate limits;
- ограничения каталога и metadata;
- соответствие static hosting/client-side архитектуре;
- необходимость второго provider в MVP;
- стоимость сложности multiple-provider aggregation;
- совместимость с ADR-001;
- реализацию provider abstraction согласно ADR-002.

Отдельно необходимо проверить, какие ограничения AniList являются приемлемыми MVP trade-offs, а какие могут нарушить BRD/NFR.

## 9. Preliminary Direction

Предварительное направление: **Option A — AniList as the Sole MVP Provider**.

Причины:

- SAD прямо определяет AniList как единственный внешний источник данных MVP;
- BRD предполагает использование одного внешнего источника на этапе MVP;
- authentication и пользовательские списки уже ориентированы на AniList;
- client-side архитектура ADR-001 допускает прямое взаимодействие браузера с AniList;
- ADR-002 позволяет сохранить provider-independent application/domain model, не требуя фактического подключения нескольких providers;
- будущие дополнительные источники можно подключить позднее через Provider Integration.

Предварительное направление не является окончательным решением до завершения validation и ответа Owner на вопросы §7.

## 10. Expected Outcome

После validation и ответа Owner необходимо выбрать Option A, B или C.

Если выбран **Option A**, RFC станет:

**ADR-003: AniList as the MVP Data Provider**

ADR-003 должен зафиксировать:

- AniList как sole provider MVP;
- какие MVP capabilities покрываются AniList;
- принятые provider limitations;
- риски зависимости от AniList;
- условия, при которых решение пересматривается;
- связь с ADR-001 и ADR-002.

До принятия ADR данный RFC остаётся `Proposed`.

## Outcome

RFC-003 завершён.

После обсуждения и validation выбран вариант:

**Option A — AniList as the Sole MVP Provider**

Решение формально зафиксировано в:

**[ADR-003 - Anilist-as-the-mvp-data-provider](../ARD's/[ADR-003]%20-%20Anilist-as-the-mvp-data-provider.md)**
