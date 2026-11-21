# frontend/CLAUDE.md

フロントエンド（React）のコマンド。共通のルールは、リポジトリのルートの CLAUDE.md を参照する。

## コマンド

ホストのNode（nvm）で、`frontend/` に移動して実行する。Nodeは `frontend/.nvmrc` の26に合わせる
（`engine-strict` のため、ほかの版では `npm ci` が失敗する）。

```bash
nvm use            # .nvmrc の版（26）に切り替える
npm ci             # package-lock.json どおりに入れる（依存の追加・更新は、確認後に npm install）
npm run dev        # 開発サーバー（http://localhost:5173）
npm run build      # 本番用ビルド（型チェックを含む）
npm run typecheck  # 型チェックだけ（0エラーでOK）
npm run lint       # ESLint（指摘0件でOK）
npm run format     # Prettierで整形する（ファイルを書き換える）
npm run format:check  # 整形済みかの確認だけ（指摘0件でOK）
npm test           # Vitest（1回実行して終わる。全件passでOK）
```
