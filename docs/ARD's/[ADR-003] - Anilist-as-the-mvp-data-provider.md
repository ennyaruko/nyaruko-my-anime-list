---
status: accepted
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# ADR-003: AniList as the MVP Data Provider

## Context and Problem Statement

На этапе MVP Anime Tracker требуется внешний data provider для получения данных об аниме и синхронизации пользовательского списка.

SAD определяет AniList как единственный внешний provider MVP. При этом архитектура должна оставаться provider-agnostic, чтобы будущие источники можно было подключать через Provider Integration без изменения core application/domain model.

BRD также допускает использование альтернативных внешних источников в будущих фазах, но не требует их интеграции в MVP.

Необходимо определить, достаточно ли AniList для MVP или уже на этом этапе необходимо использовать альтернативный или дополнительный provider.

## Decision Drivers

- Покрытие обязательных MVP use cases.
- Anime search и получение anime details.
- Работа с пользовательским списком и изменением его статусов.
- Authentication для операций с пользовательскими данными.
- Достаточность anime metadata.
- Совместимость с client-side architecture и static hosting.
- Приемлемость API rate limits и других ограничений.
- Минимальная сложность MVP.
- Возможность добавления дополнительных providers после MVP через ADR-002.
- Отсутствие необходимости в multi-provider aggregation на этапе MVP.

## Considered Options

### Option A — AniList as the Sole MVP Provider

AniList является единственным external data provider в MVP.

Все взаимодействие с AniList выполняется через Provider Integration и AniList adapter в соответствии с ADR-002.

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

Вместо AniList выбирается другой внешний provider, который должен покрывать все обязательные MVP capabilities, включая необходимые операции с пользовательским списком и authentication.

### Option C — Multiple Providers in MVP

MVP использует несколько providers одновременно для объединения или дополнения данных.

Этот вариант требует дополнительных механизмов normalization, source selection, deduplication, conflict resolution и aggregation.

## Decision Outcome

Выбран **Option A — AniList as the Sole MVP Provider**.

AniList используется как единственный внешний data provider для MVP.

Это решение соответствует текущему scope: SAD прямо определяет AniList как единственный внешний источник данных MVP, а другие providers находятся за пределами MVP.

Application и domain model при этом не становятся AniList-specific. Согласно ADR-002, AniList остаётся конкретной реализацией provider abstraction, а provider-specific DTO преобразуются adapter-ом во внутреннюю модель приложения.

### Owner Confirmation

Owner подтвердил:

1. AniList покрывает обязательные MVP use cases.
2. Ограничения каталога AniList принимаются для MVP.
3. API limitations и rate limits принимаются как архитектурный риск.
4. Cache/revalidation strategy используется для снижения влияния latency и API limitations.
5. Fallback provider в MVP не требуется.
6. Multi-provider aggregation в MVP не требуется.
7. Дополнительные providers рассматриваются как post-MVP scope.
8. Если в будущем появятся дополнительные источники, их данные не должны автоматически смешиваться с обычной моделью каталога; конкретный способ представления будет определён отдельным решением.
9. AniList удовлетворяет текущим требованиям MVP.
10. ADR-003 является решением исключительно для MVP и не требует заранее определённого пересмотра внутри MVP.

## Validation

### 1. MVP API Capabilities

**Result: PASS.**

Официальная документация AniList подтверждает GraphQL API для запросов к данным. GraphQL endpoint принимает query/mutation requests, что соответствует client-side provider integration, определённой SAD.

AniList documentation также предоставляет отдельные Media queries для получения anime/manga данных и поиска anime по названию.

### 2. User List

**Result: PASS.**

AniList предоставляет `MediaList` и `MediaListCollection` для работы с пользовательскими списками. Документация также описывает получение отдельных list entries и полной коллекции списка.

Это покрывает архитектурную необходимость MVP получать и синхронизировать пользовательские списки.

### 3. Authentication

**Result: PASS.**

AniList использует OAuth2 и поддерживает authenticated requests. Документация прямо указывает, что authentication требуется для изменения пользовательских списков и получения user-specific data.

Это соответствует BRD/SAD, где authentication пользовательского списка делегируется AniList.

### 4. Client-Side Compatibility

**Result: PASS.**

AniList официально документирует Implicit Grant для приложений, где client credentials/secret невозможно безопасно хранить, и прямо описывает его как подходящий для client-side applications.

Это совместимо с client-first MVP архитектурой ADR-001 и отсутствием собственного backend. SAD фиксирует static hosting и прямое взаимодействие web application с AniList.

### 5. Rate Limits

**Result: PASS with accepted risk.**

Официальная документация AniList указывает стандартный rate limit в 90 requests/minute, а также наличие burst limiter. На момент validation документация дополнительно предупреждает о временном degraded state с ограничением 30 requests/minute. При превышении лимита API возвращает HTTP 429 и заголовки `Retry-After` и `X-RateLimit-Reset`.

Owner принимает это как допустимый MVP risk. Архитектура уже предусматривает client-side cache и revalidation для уменьшения зависимости пользовательского сценария от latency и повторных запросов.

### 6. Need for Multiple Providers

**Result: PASS.**

В MVP нет требования к fallback provider, aggregation или объединению каталогов.

Использование нескольких providers на данном этапе добавило бы normalization, deduplication, source precedence и conflict resolution, не являющиеся обязательными MVP capabilities.

Будущие дополнительные providers остаются post-MVP scope. Это также совместимо с ADR-002, который отделяет application/domain model от конкретного provider.

### 7. Provider Coupling

**Result: PASS.**

Выбор AniList как единственного provider не противоречит provider-agnostic architecture.

AniList-specific dependency локализуется в Provider Integration, тогда как application/domain contracts остаются внутренними. Это уже принято в ADR-002.

### 8. MVP Complexity

**Result: PASS.**

Один provider позволяет избежать преждевременной aggregation architecture и сохраняет MVP в рамках client-first решения ADR-001.

SAD прямо предусматривает AniList integration как отдельный building block и оставляет возможность дальнейшего добавления providers.

## Consequences

### Positive

- MVP имеет один понятный источник внешних данных.
- Реализация provider integration остаётся относительно простой.
- Authentication и user-list synchronization используют один provider.
- Не требуется multi-provider aggregation.
- Не требуется deduplication между providers в MVP.
- Cache/revalidation может быть оптимизирована под один внешний API.
- Дополнительные providers могут быть добавлены после MVP через существующую abstraction из ADR-002.
- Application/domain model не становится зависимой от AniList.

### Negative

- Полнота каталога MVP зависит от AniList.
- Доступность AniList и его API limitations являются внешним риском.
- Rate limits могут влиять на интенсивные сценарии и требуют корректного cache/revalidation поведения.
- Контент, отсутствующий в AniList, не будет автоматически предоставляться другим источником в MVP.
- Authentication пользовательского списка зависит от AniList OAuth.

## Revisit Conditions

ADR-003 не предполагает обязательного пересмотра в рамках MVP.

Решение должно быть пересмотрено только при изменении scope или требований, например если:

- в MVP появится обязательный второй provider;
- AniList перестанет покрывать обязательные MVP requirements;
- появится обязательная агрегация данных нескольких providers;
- AniList перестанет обеспечивать необходимые authentication/user-list capabilities;
- ограничения AniList начнут нарушать согласованные MVP NFR.

Планируемое подключение дополнительных providers после MVP является отдельным architectural decision и не означает, что ADR-003 был ошибочным.

## Confirmation

Решение считается реализованным корректно, если:

- AniList является единственным external data provider в MVP;
- application/domain layers не используют AniList DTO напрямую;
- AniList integration реализована через Provider Integration / AniList Adapter;
- search и anime details работают через AniList;
- пользовательский список и status changes работают через AniList authentication;
- cache/revalidation учитывают ограничения API;
- fallback provider не является частью MVP;
- multi-provider aggregation не реализуется в MVP;
- дополнительные providers остаются post-MVP scope.

## More Information

Связанные документы:

- [SAD](../[SAD]%20-%20Solution%20Architecture%20Document.md): Solution Architecture Document
- [BRD](../[BRD]%20-%20Phase%20MVP.md): Phase MVP
- [RFC-001](<../RFC's/[RFC-001]%20-%20MVP%20Client-Side%20Architecture%20vs%20Backend(BFF).md>): Client-Side Architecture for MVP (исходный RFC, использованный для validation)
- [RFC-002](<../RFC's/[RFC-002] - Provider-agnostic-application-model-validated.md>): Provider-agnostic-application-model-validated (исходный RFC, использованный для validation)
- [RFC-003](<../RFC's/[RFC-003] - Anilist-as-the-mvp-data-provider.md>): Anilist-as-the-mvp-data-provider (исходный RFC, использованный для validation)
