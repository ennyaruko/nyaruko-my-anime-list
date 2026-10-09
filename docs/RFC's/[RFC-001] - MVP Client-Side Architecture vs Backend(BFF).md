---
status: superseded by ADR-001cepted
date: 2026-10-05
decision-makers: Maxim (Owner)
consulted: TBD
informed: TBD
---

# RFC-001: Client-Side Architecture for MVP

## 1. Context4

Anime Tracker MVP должен предоставить пользователю поиск аниме,
просмотр карточки и управление личным списком.

В рамках MVP приложение должно быть доступно как web-приложение
и размещаться на бесплатном или условно бесплатном static hosting.

Система использует AniList как внешний источник данных и требует
аутентификации пользователя для работы с его списком.

На текущем этапе отсутствуют требования к собственной серверной
бизнес-логике, собственной базе данных или сбору пользовательской
аналитики.

Существующий SAD предполагает client-side архитектуру для MVP
с возможной последующей эволюцией к BFF/SSR.

## 2. Problem Statement

Как должна быть организована runtime-архитектура Anime Tracker MVP:

- полностью на стороне клиента;
- или через собственный backend / BFF?

Необходимо выбрать архитектуру, которая обеспечивает требования MVP,
минимизирует сложность разработки и эксплуатации и при этом не создаёт
необоснованных ограничений для дальнейшего развития системы.

## 3. Decision Drivers

Основные критерии выбора:

1. Простота реализации MVP.
2. Стоимость и сложность инфраструктуры.
3. Возможность deployment на static hosting.
4. Безопасность OAuth credentials и пользовательских данных.
5. Производительность основного пользовательского сценария.
6. Зависимость от внешнего API.
7. Возможность дальнейшей эволюции архитектуры.
8. Возможность добавления других data providers.
9. Соответствие требованиям BRD и NFR.
10. Сложность поддержки и эксплуатации.

## 4. Considered Options

### Option A — Client-Side Application

Browser выполняет основную application logic и напрямую
взаимодействует с AniList API.

Deployment:

Browser
→ GitHub Pages
→ AniList API

Client-side storage используется для persistence и cache.

### Option B — Backend / BFF

Browser взаимодействует с собственным backend/BFF.

Deployment:

Browser
→ BFF
→ AniList API

Application logic, provider integration и потенциально persistence
частично или полностью находятся на серверной стороне.

### Option C — Hybrid / BFF later

На этапе MVP используется client-side architecture.

Архитектурные границы и application contracts проектируются таким
образом, чтобы в дальнейшем provider integration и server-side
responsibilities могли быть перенесены в BFF без изменения
domain/application model.

## 5. Evaluation Criteria

| Criterion                     | Option A | Option B | Option C |
| ----------------------------- | -------- | -------- | -------- |
| MVP implementation complexity | TBD      | TBD      | TBD      |
| Infrastructure cost           | TBD      | TBD      | TBD      |
| Static hosting compatibility  | TBD      | TBD      | TBD      |
| OAuth/token handling          | TBD      | TBD      | TBD      |
| Runtime performance           | TBD      | TBD      | TBD      |
| External API dependency       | TBD      | TBD      | TBD      |
| Future extensibility          | TBD      | TBD      | TBD      |
| Operational complexity        | TBD      | TBD      | TBD      |

## 6. Trade-offs

### Option A — Client-Side

**Advantages**

- минимальная инфраструктура;
- отсутствует собственный backend;
- deployment через static hosting;
- минимальная стоимость эксплуатации;
- быстрый путь к MVP;
- application logic выполняется непосредственно в браузере.

**Disadvantages**

- клиент напрямую зависит от внешнего API;
- OAuth token находится в browser context;
- сложнее скрывать provider-specific credentials;
- server-side aggregation нескольких providers отсутствует;
- часть будущих требований может потребовать архитектурной миграции.

### Option B — Backend / BFF

**Advantages**

- единая серверная точка интеграции с provider;
- можно скрыть provider-specific integration;
- проще реализовать server-side aggregation;
- проще централизовать некоторые cross-cutting concerns;
- потенциально проще расширять backend capabilities.

**Disadvantages**

- появляется собственная инфраструктура;
- появляется server-side runtime;
- возрастает стоимость и сложность deployment;
- необходимо поддерживать backend;
- для MVP появляется значительный объём дополнительной
  архитектурной и operational complexity.

### Option C — Hybrid / BFF later

**Advantages**

- сохраняет простоту client-side MVP;
- позволяет подготовить архитектуру к BFF;
- logical boundaries сохраняются независимо от физического размещения;
- migration может выполняться постепенно.

**Disadvantages**

- требуется заранее определить application/domain/provider contracts;
- часть архитектурных abstraction может быть не нужна MVP;
- существует риск premature abstraction;
- фактический переход к BFF потребует отдельной migration work.

## 7. Open Questions

1. Требуется ли MVP собственная серверная логика, которой невозможно
   реализовать на клиенте?

2. Есть ли требования к скрытию OAuth credentials от browser?

3. Требуется ли server-side aggregation нескольких providers в MVP?

4. Требуется ли server-side persistence пользовательских данных?

5. Есть ли ограничения AniList API, которые делают direct client
   integration неприемлемой?

6. Какие ограничения существуют у AniList OAuth flow при deployment
   через GitHub Pages?

7. Какие security risks возникают при хранении OAuth token в browser?

8. Требуется ли BFF для выполнения NFR MVP?

## 8. Validation Plan

Перед превращением RFC в ADR необходимо проверить:

- OAuth flow с GitHub Pages;
- прямой client-side доступ к AniList API;
- работу GraphQL API из browser;
- CORS / browser restrictions;
- rate limits;
- latency основного сценария;
- хранение и восстановление client-side state;
- соответствие NFR по performance;
- security implications хранения access token;
- возможность реализации всех MUST-функций без backend.

## 9. Proposed Direction

Предварительно предлагается Option C:

**Client-side architecture for MVP with explicit architectural
boundaries that allow future migration to BFF/SSR.**

Это не является окончательным архитектурным решением.

Окончательный выбор должен быть сделан после завершения validation.

## 10. Expected Outcome

Если validation подтвердит, что client-side architecture удовлетворяет
требованиям MVP, RFC может быть преобразован в:

**ADR-001: Client-Side Architecture for MVP**

Если validation выявит ограничения, RFC должен быть обновлён с учётом
результатов исследования и решение может быть принято в пользу
Backend/BFF или другого варианта.

## Outcome

RFC-001 завершён.

После обсуждения и validation выбран вариант:

**Option C — Client-Side MVP with Future BFF/SSR Evolution.**

Решение формально зафиксировано в:

**[ADR-001: Client-Side Architecture for MVP](../ARD's/[ADR-001]%20-%20Client-Side%20Architecture%20for%20MVP.md)**

ADR-001 является authoritative source для принятого архитектурного
решения.

Этот RFC сохраняется как исторический документ, содержащий исходную
постановку проблемы, рассмотренные варианты и процесс их validation.

## Validation Result

| #   | Validation Point                 | Result                  |
| --- | -------------------------------- | ----------------------- |
| 1   | Server-side business logic       | PASS                    |
| 2   | OAuth credentials protection     | PASS with accepted risk |
| 3   | Server-side provider aggregation | PASS                    |
| 4   | Server-side persistence          | PASS                    |
| 5   | AniList client-side restrictions | PASS                    |
| 6   | Static hosting restrictions      | PASS                    |
| 7   | OAuth token security             | ACCEPTED                |
| 8   | MVP NFR requiring backend        | PASS                    |

## Final Status

**Superseded by ADR-001.**

The architectural decision resulting from this RFC is documented in
ADR-001.
