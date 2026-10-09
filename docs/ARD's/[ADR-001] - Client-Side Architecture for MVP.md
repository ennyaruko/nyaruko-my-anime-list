---
status: accepted
date: 2026-10-05
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# ADR-001: Client-Side Architecture for MVP

## Context and Problem Statement

MVP Anime Tracker не требует серверной бизнес-логики, собственной базы данных, серверной агрегации провайдеров или серверного хранения данных. MVP предполагается разворачивать как статическое web-приложение и использовать AniList как внешний источник данных.

Поэтому необходимо определить, должен ли MVP полностью оставаться client-side или следует вводить backend/BFF до появления реальной необходимости в нём.

При принятии решения также необходимо учитывать OAuth-модель AniList, доступ к API из браузера, ограничения API по частоте запросов, ограничения static hosting, последствия с точки зрения безопасности и возможность дальнейшей эволюции к архитектуре BFF/SSR.

## Decision Drivers

- Минимальная сложность реализации и эксплуатации MVP.
- Совместимость со static hosting, например GitHub Pages.
- Отсутствие ненужной backend-инфраструктуры и эксплуатационных затрат.
- Прямая интеграция браузера с AniList.
- Приемлемый способ работы с OAuth/token для MVP личного использования.
- Производительность основных пользовательских сценариев.
- Возможность добавить backend/BFF позже, если требования изменятся.
- Возможность изолировать provider-specific интеграцию от domain/application model.
- Соответствие требованиям MVP и NFR, определённым в BRD/SAD.

## Considered Options

1. **Option A — Client-Side Application**
   - Application logic выполняется в браузере.
   - Браузер напрямую взаимодействует с AniList.
   - Client-side storage используется для persistence/cache.

2. **Option B — Backend / BFF**
   - Браузер взаимодействует с собственным backend/BFF.
   - Backend взаимодействует с AniList.
   - В MVP добавляются server-side runtime и соответствующая инфраструктура.

3. **Option C — Client-Side MVP with Future BFF/SSR Evolution**
   - MVP использует client-side архитектуру из Option A.
   - Границы application, domain, persistence, synchronization и provider integration остаются явно выделенными.
   - Будущие server-side responsibilities могут быть перенесены за BFF/SSR layer без изменения основных application/domain contracts.

## Decision Outcome

Выбранный вариант: **Option C — Client-Side MVP with Future BFF/SSR Evolution**.

MVP будет работать как client-side web application и напрямую взаимодействовать с AniList. Собственный backend или server-side runtime не будут добавляться исключительно ради MVP.

При этом архитектура сохранит логические границы между presentation, application, domain, persistence/synchronization и provider integration. Это позволяет сохранить простую текущую модель deployment и при необходимости в будущем перейти к BFF/SSR, если появятся соответствующие требования.

Решение принято, поскольку validation не выявила текущего требования MVP, которое нуждалось бы в server-side execution, а AniList явно поддерживает browser/client applications через OAuth Implicit Grant и предоставляет GraphQL API для client requests.

## Consequences

### Positive

- MVP может быть развёрнут как статическое web-приложение.
- Собственный backend или database server не требуется.
- Сложность инфраструктуры и эксплуатации остаётся низкой.
- Прямая коммуникация client-to-AniList позволяет избежать ненужного proxy layer.
- Архитектура сохраняет возможность эволюции в сторону BFF/SSR.
- Provider-specific concerns могут оставаться изолированными от domain model.

### Negative / Accepted Risks

- OAuth access tokens находятся в browser context и поэтому не могут быть защищены как server-side secrets.
- AniList не поддерживает OAuth scopes; access tokens предоставляют практически полный доступ к данным пользователя.
- Access tokens AniList имеют длительный срок действия (в настоящее время один год), а refresh tokens не поддерживаются.
- Приложение напрямую зависит от доступности AniList и ограничений его API.
- AniList в настоящее время документирует стандартное ограничение в 90 requests/minute, но также указывает, что API временно работает в degraded state с ограничением 30 requests/minute. Поэтому приложение должно обрабатывать rate limiting и HTTP 429 responses.
- Появление требования к server-side aggregation, защите secrets, server-side persistence или другой backend-only functionality потребует введения BFF/server-side layer.

Риски OAuth/token явно принимаются для MVP, поскольку проект предназначен для личного использования и в настоящее время отсутствует требование скрывать token от клиента.

## Validation

### 1. Server-side business logic required by MVP

**Result: PASS.**

Owner подтвердил, что MVP не содержит бизнес-логики, требующей server-side execution.

### 2. Requirement to hide OAuth credentials

**Result: PASS with accepted risk.**

Требования хранить OAuth credentials на серверной стороне нет. AniList явно рекомендует OAuth Implicit Grant для приложений, в которых client credentials/secret нельзя безопасно хранить, и относит websites/mobile apps к типичным сценариям использования. Access token возвращается клиенту в redirect URL fragment, благодаря чему серверу не требуется его хранить.

AniList также документирует, что access tokens имеют длительный срок действия и что OAuth scopes не поддерживаются. Это подтверждает техническую реализуемость client-side flow и одновременно делает security trade-off явным.

### 3. Server-side provider aggregation required by MVP

**Result: PASS.**

В MVP такого требования нет.

### 4. Server-side persistence required by MVP

**Result: PASS.**

Собственное server-side persistence не требуется. Данные пользовательского списка синхронизируются с AniList, а client-side storage используется для application state/cache согласно SAD.

### 5. AniList restrictions preventing client-side usage

**Result: PASS.**

AniList явно поддерживает OAuth Implicit Grant для приложений, в которых запросы выполняются клиентом пользователя. В документации GraphQL также приведены JavaScript `fetch` examples, выполняющие запросы непосредственно к `https://graphql.anilist.co`. Аутентифицированные запросы используют Bearer token в request header.

### 6. Static hosting restrictions

**Result: PASS.**

GitHub Pages является static hosting service, который публикует HTML/CSS/JavaScript и не предоставляет server-side runtime. Это совместимо с выбранной архитектурой, поскольку API calls выполняются браузером пользователя напрямую к AniList, а не GitHub Pages.

Следовательно, GitHub Pages не требуется ни проксировать, ни выполнять запросы к AniList.

### 7. OAuth token security risk

**Result: ACCEPTED.**

Client-side OAuth token может быть доступен коду, выполняющемуся в браузере. Это неотъемлемое следствие выбора client-side архитектуры для authenticated API access.

Риск принимается для MVP, поскольку проект предназначен для личного использования и требования к server-side token protection отсутствуют. Нельзя считать, что client-side storage устраняет этот риск; он остаётся явным архитектурным trade-off.

### 8. MVP NFR requiring a backend

**Result: PASS.**

Ни один текущий MVP NFR не требует собственного backend. SAD определяет MVP как client-side application без application server и рассматривает BFF/SSR как будущую архитектурную эволюцию.

## Confirmation

Решение считается корректно реализованным, если:

- production MVP может быть развёрнут как static assets;
- для runtime MVP не требуется собственный backend;
- доступ к AniList выполняется напрямую из браузера;
- OAuth использует подходящий для клиента flow и client secret не встраивается в приложение как замена server-side secret;
- provider-specific DTOs/authentication details остаются изолированными от domain model;
- rate-limit и provider errors обрабатываются приложением;
- application/domain contracts остаются независимыми от физического размещения provider integration.

## Revisit Conditions

Это решение следует пересмотреть, если появится хотя бы одно из следующих требований:

- становится необходима server-side business logic;
- требуется provider aggregation или orchestration;
- становится необходима server-side persistence;
- OAuth credentials/tokens необходимо защитить от браузера;
- появляются дополнительные требования безопасности или compliance;
- client-side API access становится недостаточным из-за ограничений provider;
- rate limits или доступность provider существенно мешают MVP выполнять требования;
- SSR становится продуктовым или performance requirement.

## More Information

Связанная архитектурная документация:

- [SAD](../[SAD]%20-%20Solution%20Architecture%20Document.md): Solution Architecture Document
- [BRD](../[BRD]%20-%20Phase%20MVP.md): Phase MVP
- [RFC-001](<../RFC's/[RFC-001]%20-%20MVP%20Client-Side%20Architecture%20vs%20Backend(BFF).md>): Client-Side Architecture for MVP (исходный RFC, использованный для validation)

Выбранная архитектура соответствует существующей в SAD стратегии client-first architecture с provider-agnostic application/domain boundaries и возможной будущей миграцией к BFF/SSR.
