# Entity Relationship Diagram

```mermaid
---
title: Animal example
---
erDiagram
    Users ||--o{ Votes : "UserからのVote"
    Users }o--o{ Projects : "複数UserからなるProject"
    Users ||--|| Proposals : "1UserからのProposal"
    Projects ||--o{ Proposals : "Projectに対するProposal"
    Proposals ||--o{ Votes : "Proposalに対するVote"
    Users {
        BIGINT id PK
        CHAR(42) wallet_address
        CHAR email
        CHAR icon
    }
    Projects {
        BIGINT id PK
        CHAR title
        CHAR logo
        LONGTEXT description "Markdown"
        CHAR purpose
        DATE deadline
        DATE vote_deadline
        SMALLINT(4) phase
        BOOL invalid
    }

    Votes {
        BIGINT id PK
        BOOL vote
    }

    Proposals {
        BIGINT id PK
        CHAR title
        LONGTEXT description "Markdown"
    }
```

## Reference

- https://mermaid.js.org/
- https://mermaid.live/
- [【MySQL】データ型一覧](https://ysklog.net/mysql/1797.html)
- [【Mermaid】ER図の作成方法](https://qiita.com/P-man_Brown/items/33834fe6dd4833dc1809)
- [MermaidでER図を書いてみました](https://zenn.dev/aldagram_tech/articles/a10166f763d30e)
