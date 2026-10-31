---
status: accepted
date: 2026-10-06
decision-makers: Maxim (Owner)
consulted: None
informed: None
---

# RFC-002: Provider-Agnostic Application Model

## 1. Context and Problem Statement

На этапе MVP Anime Tracker использует AniList как единственный внешний data provider.

При этом архитектура должна сохранить возможность дальнейшего добавления или замены provider без изменения application/domain model. BRD уже допускает будущую интеграцию альтернативных внешних источников для контента, которого может не быть в AniList.

## 2. Problem Statement

Как должна быть организована модель данных и взаимодействие application layer с внешним data provider:

- использовать модели и DTO AniList непосредственно во внутренней части приложения;
- или определить собственную application/domain model и изолировать AniList через provider adapter?

## 3. Decision Drivers

1. Независимость application/domain layer от AniList.
2. Возможность добавить или заменить data provider.
3. Полное отделение internal model от provider-specific DTO.
4. Устойчивость application/domain contracts к изменениям provider API.
5. Возможность последующей миграции к BFF/SSR.
6. Приемлемая сложность реализации MVP.

## 4. Considered Options

### Option A — Direct AniList Models

Application/domain layers используют структуры данных AniList напрямую.

### Option B — Internal Application/Domain Model + Provider Adapter

Application/domain layers используют собственные внутренние модели. AniList-specific DTO остаются внутри provider integration layer и преобразуются adapter-ом во внутреннюю модель.

### Option C — Minimal Mapping / Anti-Corruption Boundary

Собственная внутренняя модель используется для наиболее значимых сущностей, но часть provider-derived structures допускается использовать напрямую.

## 5. Owner Decision

Owner выбрал **Option B — Internal Application/Domain Model + Provider Adapter**.

Причины:

- существует предполагаемая вероятность второго provider;
- BRD уже предусматривает будущие альтернативные базы данных для контента, которого может не быть в AniList;
- Owner требует полного отделения application/domain model от provider-specific DTO;
- архитектура должна поддерживать abstraction;
- BFF/SSR evolution должна сохранять core application/domain contracts.

## 6. Validation

**Result: PASS.**

Валидация по исходным документам и внешним техническим источникам не выявила причины отклонять Option B.

Ключевые результаты:

- SAD уже определяет Provider Integration как boundary с DTO → Domain mapping;
- AniList Media содержит широкую provider-specific модель и множество AniList-specific concepts; прямое использование этой модели внутри domain/application увеличило бы coupling.
- GraphQL допускает эволюцию schema, но breaking changes всё равно возможны; adapter локализует влияние внешней schema на внутренние contracts.
- Gateway/Anti-Corruption подход соответствует задаче изоляции внешнего vocabulary и перевода его во внутренний model.
- Выбранный подход совместим с layering и с будущим BFF/SSR из ADR-001.

### Important Implementation Clarification

Полное отделение означает, что все данные, которые входят во внутренние application/domain contracts, проходят через mapping.

При этом internal model не должна становиться механической копией всей AniList schema. Provider-only поля остаются внутри provider DTO, если они не являются частью внутреннего application/domain contract.

## 7. Outcome

RFC закрыт как принятое решение.

**[Authoritative decision: [ADR-002] — Provider-Agnostic Application Model](../ARD's/[ADR-002]%20-%20Provider-agnostic-application-model.md)**

RFC-002 остаётся историческим record процесса принятия решения, а ADR-002 является authoritative source для реализации.
