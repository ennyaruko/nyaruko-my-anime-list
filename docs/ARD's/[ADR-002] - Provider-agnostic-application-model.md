---
status: accepted
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# ADR-002: Provider-Agnostic Application Model

## Context and Problem Statement

На этапе MVP Anime Tracker используется AniList как единственный внешний data provider. При этом архитектура должна сохранить возможность дальнейшего добавления или замены provider без изменения application/domain model.

BRD уже допускает будущую потребность в альтернативных внешних источниках данных для контента, которого может не быть в AniList. В SAD также зафиксирована стратегия provider-agnostic domain model, в которой provider-specific DTO преобразуются adapter-ом во внутреннюю модель приложения.

Необходимо определить, должна ли application/domain model напрямую использовать AniList DTO или должна быть полностью отделена от provider-specific data model.

## Decision Drivers

- Полная независимость application/domain model от AniList DTO.
- Возможность добавить или заменить data provider без изменения core application/domain logic.
- Изоляция provider-specific concepts и authentication details.
- Устойчивость application/domain contracts к изменениям внешнего API.
- Возможность дальнейшей эволюции к BFF/SSR без изменения core model.
- Поддержка будущих сценариев с несколькими data providers.
- Приемлемая сложность реализации MVP.
- Соответствие архитектуре, уже определённой в SAD и ADR-001.

## Considered Options

1. **Option A — Direct AniList Models**
   - Application/domain используют структуры и DTO AniList напрямую.
   - Provider-specific model становится частью внутреннего application contract.

2. **Option B — Internal Application/Domain Model + Provider Adapter**
   - Application/domain используют собственные внутренние модели и контракты.
   - AniList DTO остаются внутри provider integration.
   - Adapter выполняет преобразование Provider DTO → Internal Application/Domain Model.

3. **Option C — Minimal Mapping / Anti-Corruption Boundary**
   - Собственная модель создаётся только для части значимых сущностей.
   - Для части данных допускается использование provider-neutral/provider-derived structures.
   - Граница между внутренней моделью и provider остаётся менее строгой.

## Decision Outcome

Выбранный вариант: **Option B — Internal Application/Domain Model + Provider Adapter**.

Application и domain layers не должны зависеть от AniList-specific DTO или структуры AniList GraphQL schema.

В MVP AniList остаётся единственным конкретным provider implementation, но доступ к нему выполняется через provider abstraction и adapter. Adapter отвечает за преобразование provider-specific DTO во внутреннюю модель приложения.

Решение принято потому, что:

- Owner предполагает реальную возможность добавления второго provider в будущих фазах;
- BRD уже фиксирует будущий сценарий расширения каталога через альтернативные внешние базы данных;
- SAD изначально определяет provider-agnostic domain model и Provider Integration как отдельный architectural building block;
- AniList API содержит provider-specific структуру и широкий набор полей/связей, которые не должны становиться частью внутреннего контракта приложения;
- стандартный подход Gateway / Anti-Corruption Layer предусматривает изоляцию внешнего vocabulary и перевод его в модель потребляющей системы;
- выбранная модель сохраняет возможность последующей миграции provider integration за BFF/SSR boundary.

### Implementation Rule

Полное отделение модели означает, что **все данные, которые входят в application/domain contracts, должны проходить через внутреннюю модель и mapping**.

Это не означает, что внутренняя модель должна быть зеркальной копией всей AniList schema. Provider-only поля и структуры, которые не являются частью application/domain contract, остаются provider-specific DTO внутри adapter. Это позволяет одновременно выполнить требование полной изоляции и не превратить domain model в копию внешнего API.

### Consequences

#### Positive

- Application/domain code не зависит от AniList DTO.
- Замена или добавление provider локализуется преимущественно в Provider Integration.
- Изменения AniList schema не должны автоматически распространяться по application/domain layers.
- Provider-specific authentication и integration details остаются за границей domain model.
- Возможна нормализация различий между несколькими provider через единый внутренний контракт.
- BFF/SSR evolution из ADR-001 может использовать те же application/domain contracts.
- Application/domain logic может работать с fake/mock provider без зависимости от реального AniList API.

#### Negative

- Появляется дополнительный mapping layer.
- Необходимо поддерживать внутренние модели и provider DTO отдельно.
- При добавлении нового provider потребуется реализовать новый adapter и соответствующий mapping.
- Возникает дополнительный код и необходимость явно поддерживать mapping rules.
- Если внутреннюю модель сделать слишком широкой и полностью повторяющей внешний API, abstraction потеряет часть своей ценности.

## Validation

### 1. Future Second Provider

**Result: PASS.**

BRD прямо исключает интеграцию альтернативных баз данных для расширения NSFW-контента из MVP, но оставляет этот сценарий для будущих фаз. В предоставленном backlog также зафиксированы будущие задачи, связанные с дополнительными источниками данных, включая Shikimori API и дополнительные сайты/источники.

Это создаёт реальный архитектурный мотив для provider abstraction, даже если второй provider не входит в MVP.

### 2. Provider DTO Isolation

**Result: PASS.**

SAD уже определяет Provider Integration как отдельный building block с обязанностью преобразовывать данные из формата provider во внутреннюю модель приложения. Также SAD явно указывает, что UI и application layer не должны зависеть от структуры AniList API.

Это соответствует общему принципу изоляции внешней системы через Gateway/Adapter: внешний API может иметь vocabulary и структуру, неудобные или специфичные для consuming system, поэтому boundary может переводить внешний API в собственный интерфейс системы.

Martin Fowler описывает Gateway как объект, инкапсулирующий доступ к внешней системе и переводящий её API в интерфейс, соответствующий терминам самой системы. Он также связывает этот подход с Anti-Corruption Layer.

### 3. AniList Schema Coupling

**Result: PASS.**

AniList Media является широкой provider-specific моделью, включающей, среди прочего, titles, status, genres, tags, relations, characters, staff, studios, external links, streaming episodes, rankings, reviews, recommendations и другие поля. Она также объединяет anime и manga в одной модели Media.

Следовательно, прямое использование AniList Media как внутренней application/domain model означало бы перенос большого количества provider-specific concepts внутрь приложения.

### 4. External API Evolution

**Result: PASS.**

AniList использует GraphQL, который специально ориентирован на эволюцию schema без традиционного versioning, однако breaking changes всё равно возможны. Официальная GraphQL documentation определяет изменения, способные сделать ранее валидный запрос невалидным, как breaking changes.

Provider adapter локализует влияние таких изменений: изменения внешнего schema должны в первую очередь обрабатываться на provider boundary, пока application/domain contract остаётся стабильным.

### 5. Multiple Provider Normalization

**Result: PASS.**

AniList уже демонстрирует, что внешний provider имеет собственные semantics: например, Media объединяет anime и manga, имеет AniList-specific enums, связи и поля вроде `isAdult`, `mediaListEntry`, `reviews`, `recommendations` и `externalLinks`. citeturn1search0

Если в будущем появится другой provider с иной структурой, внутренний model позволяет нормализовать только те concepts, которые действительно нужны Anime Tracker.

### 6. Application / Domain Boundary

**Result: PASS.**

SAD определяет Domain Model как набор основных сущностей системы, независимый от внешних API и механизмов хранения, а Application Layer — как слой use cases, application services и contracts. Provider Integration отвечает за abstraction, adapters и DTO → Domain mapping.

Такое разделение также соответствует принципам layering: domain layer не должен напрямую обращаться к внешним системам; внешнее взаимодействие следует изолировать за отдельным boundary.

### 7. Testing Requirement

**Result: PASS.**

Owner не требует на данном этапе полного автоматизированного тестового покрытия проекта. Поэтому отдельное решение не зависит от введения полноценной testing architecture.

При этом provider abstraction сохраняет возможность изолированно тестировать application/domain logic в будущем без реального AniList API. Это является архитектурным преимуществом, но не является обязательным MVP requirement.

### 8. BFF / SSR Evolution

**Result: PASS.**

ADR-001 уже устанавливает client-first MVP с сохранением логических границ между application, domain, persistence/synchronization и provider integration. Provider-agnostic model не зависит от того, выполняется ли provider integration в браузере или позднее за BFF/SSR.

Поэтому перенос provider integration на server-side не требует изменения core application/domain model.

## Pros and Cons of the Options

### Option A — Direct AniList Models

- Good, because требует минимального количества mapping code.
- Good, because проще начать реализацию MVP.
- Bad, because application/domain становятся связаны с AniList.
- Bad, because provider-specific concepts проникают во внутреннюю модель.
- Bad, because второй provider потребует изменений application/domain contracts.
- Bad, because изменения внешней schema потенциально распространяются дальше provider boundary.

### Option B — Internal Application/Domain Model + Provider Adapter

- Good, because полностью выполняет требование Owner по отделению модели от provider DTO.
- Good, because соответствует существующей архитектуре SAD.
- Good, because позволяет добавить второй provider без изменения core application/domain contracts.
- Good, because локализует provider-specific mapping.
- Good, because поддерживает BFF/SSR evolution.
- Bad, because требует дополнительного mapping и отдельных моделей.
- Bad, because необходимо поддерживать mapping rules.

### Option C — Minimal Mapping / Anti-Corruption Boundary

- Good, because требует меньше mapping code, чем Option B.
- Good, because сохраняет часть provider boundary.
- Bad, because граница получается менее строгой.
- Bad, because сложнее определить, какие provider-specific structures допустимы внутри application/domain.
- Bad, because при появлении второго provider возрастает риск provider leakage.
- Bad, because не соответствует прямому требованию Owner о полном отделении модели от provider-specific DTO.

## Confirmation

Решение считается корректно реализованным, если:

- application/domain contracts не импортируют и не используют AniList-specific DTO;
- AniList DTO существуют только внутри Provider Integration;
- существует provider interface/contract, через который application layer взаимодействует с внешним provider;
- AniList реализован через отдельный adapter;
- Provider DTO преобразуются в internal application/domain model;
- добавление нового provider не требует изменения core domain model без необходимости появления нового domain concept;
- provider-specific authentication details не попадают в domain model;
- application/domain code не зависит от конкретной GraphQL schema AniList;
- BFF/SSR может в будущем использовать те же application/domain contracts.

## Revisit Conditions

Решение следует пересмотреть, если:

- фактическая необходимость второго provider исчезнет надолго и abstraction начнёт создавать неоправданную сложность;
- появится требование использовать provider-specific capabilities непосредственно в core domain;
- появится необходимость в provider aggregation/orchestration, требующая изменения boundary;
- внутренний model начнёт превращаться в неконтролируемую копию AniList schema;
- BFF/SSR migration выявит необходимость изменить application contracts.

## More Information

Связанные документы:

- [SAD](../[SAD]%20-%20Solution%20Architecture%20Document.md): Solution Architecture Document
- [BRD](../[BRD]%20-%20Phase%20MVP.md): Phase MVP
- [RFC-001](<../RFC's/[RFC-001]%20-%20MVP%20Client-Side%20Architecture%20vs%20Backend(BFF).md>): Client-Side Architecture for MVP (исходный RFC, использованный для validation)
- [RFC-002](<../RFC's/[RFC-002] - Provider-agnostic-application-model-validated.md>): Provider-agnostic-application-model-validated (исходный RFC, использованный для validation)
