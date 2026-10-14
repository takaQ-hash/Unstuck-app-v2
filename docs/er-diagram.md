# ER図（本リリース版）

```mermaid
erDiagram
    teams |o--o{ users : "所属（任意）"
    users ||--o{ tasks : "作成"
    users ||--o{ push_subscriptions : "端末登録"
    tasks ||--o{ reports : "報告"
    tasks ||--o{ notifications : "通知履歴"

    teams {
        bigint id PK
        varchar name "チーム名"
        varchar invite_code UK "招待コード（再発行で更新）"
        datetime created_at
        datetime updated_at
    }

    users {
        bigint id PK
        bigint team_id FK "NULL可（個人利用）"
        varchar name
        varchar email UK
        varchar encrypted_password
        integer role "enum: general / admin"
        datetime terms_agreed_at "規約の同意日時"
        varchar terms_version "同意した規約のバージョン"
        datetime created_at
        datetime updated_at
    }

    tasks {
        bigint id PK
        bigint user_id FK
        varchar name
        date deadline
        integer notification_type "enum: interval / fixed_time"
        varchar notification_value
        boolean notification_enabled "タスクごとの通知ON/OFF"
        datetime closed_at "クローズ日時（NULL=未クローズ）"
        datetime created_at
        datetime updated_at
    }

    reports {
        bigint id PK
        bigint task_id FK
        integer status "enum: in_progress / struggling"
        text memo
        datetime created_at
        datetime updated_at
    }

    notifications {
        bigint id PK
        bigint task_id FK
        datetime scheduled_at "予約した通知時刻"
        datetime sent_at "実際の送信時刻（NULL=未送信）"
        datetime created_at
        datetime updated_at
    }

    push_subscriptions {
        bigint id PK
        bigint user_id FK
        varchar endpoint
        varchar p256dh
        varchar auth
        datetime created_at
        datetime updated_at
    }
```

## 設計メモ
- Deviseが自動生成する列（`reset_password_token`、`reset_password_sent_at`、`remember_created_at`など）は省略している。
- `users.role`が`admin`のユーザーは、同じ`team_id`につき1人までとする（アプリ側の検証と、部分ユニークインデックスで担保する）。
- チームから外す操作は`users.team_id`をNULLにするだけで、本人のタスク・報告は残る。
- 奮闘中の継続日数は列を持たず、`reports`から集計する。
