# CLAUDE.md

## プロジェクト概要
Unstuck-app v2。React（frontend/）＋ Rails API（backend/）のモノレポ。
※バージョン: Ruby 4.0 / Rails 8.1（API mode）  
詳細は README.md と docs/er-diagram.md を参照する。

### ディレクトリ構成
```
backend/    Rails API（#4で作成済み）
frontend/   React（まだ無い。#8で作成予定）
docs/       設計資料（ER図・画面遷移図など）
.github/    Issue・PRテンプレート
.claude/    Claude Codeのチーム共有設定（settings.json）
```

## コマンド
確定したものだけを書く。未確定のものは、各Issueで追記する。

### バックエンド（Rails）
ホストにRubyは入れていないため、Dockerの `ruby:4.0.7` イメージで実行する。
compose.yml は #12・#13 で整備する。それまでは次の形で一時的に起動する。
```bash
# Railsサーバーをバックグラウンドで起動する
docker run -d --rm --name unstuck-rails -v "$PWD":/app -w /app/backend \
  -v unstuck_bundle:/usr/local/bundle -p 3000:3000 \
  -e HOST_UID=$(id -u) -e HOST_GID=$(id -g) ruby:4.0.7 \
  bash -c 'bundle install && bundle exec rails s -b 0.0.0.0'

# ヘルスチェック（200が返ればOK）
curl -i http://localhost:3000/up

# 停止する前に、コンテナ内で作られたファイルの所有者を戻す
docker exec unstuck-rails bash -c 'chown -R $HOST_UID:$HOST_GID /app/backend'
docker stop unstuck-rails
```

### 未確定（各Issueで追記する）
- RuboCop: #5
- Brakeman: #6
- RSpec: #7
- フロントエンドの起動・ビルド・型チェック: #8
- ESLint・Prettier: #9
- Vitest: #10

## 基本方針
- 1 Issue = 1 PR とする
- 実装前に `gh issue view <番号>` でIssueを読み、タスクと受け入れ条件を仕様として実装する
- Issueの範囲外の変更はしない。必要だと思った場合は、実装せず提案にとどめる
- 不明点や、方法が複数ある場合は、推測で進めず、案を提示してユーザーに確認する
- 返答、コミットメッセージの本文、PR本文は日本語で書く

## 作業の流れ
1. `gh issue view <番号>` でIssueを読む
2. 計画モード（実装前に計画だけを立てるモード）で計画を立て、ユーザーの承認をとる
3. developを最新にして（`git pull origin develop`）、ブランチを作成する
4. 実装する（タスクのチェック項目1つ＝1コミットを目安に区切る）
5. チェック項目ごとにコミットする
6. 「プッシュ前のチェック」を実行し、変更内容と確認方法をユーザーに報告する
7. ユーザーの確認後、featureブランチを push する
8. PRを作成する（作成先は develop）
9. マージはユーザーが行う

## 提案の出し方
ユーザーは学習中のため、判断しやすい形で提案する。
- 結論（おすすめの案と、その理由）を先に書く
- 選択肢や専門用語は、初めて出たときに1行で説明する
- 各案に「何が変わるか」「やり直せるか（元に戻せるか）」を1行ずつ書く
- 実行するコマンドは、何をするものかを日本語で1〜2行で説明する

## Claudeが行う操作と、確認が必要な操作
- コミット・push・PR作成は Claudeが行う。マージはユーザーが行う
- コミット: 確認なしで行ってよい（`.claude/settings.json` で allow）
- push・PR作成: 実行の前に、変更内容を報告する。実行時には毎回確認画面が出る（settings.json で ask）
- 依存パッケージの追加・更新、DBマイグレーションの実行: 今までどおり、実行前にユーザーの確認をとる

## 禁止事項
次の操作は `.claude/settings.json` の deny で拒否される。別の書き方で回避しようとしない。
- PRのマージ（マージは必ずユーザー自身が行う）
- force push、develop・mainへの直接push
- `.env`・`master.key` などのシークレットの読み取り・コミット

settings.json で止められない書き方（例: `git -C . push`）もあるため、GitHubのブランチ保護でも防ぐ（ユーザーが設定する）。

## ブランチ名
`feat/`、`fix/`、`chore/`、`docs/` のいずれかで始める（developから作成）。
例: `chore/add-claude-md`

## コミット
- Conventional Commits（`feat:`・`fix:`・`docs:`・`chore:` などの接頭辞を付ける書き方）に従う
- 接頭辞は英語、件名と本文は日本語で書く
- 1コミット＝1つの論理的な変更とする（Issueのチェック項目1つ＝1コミットが目安）
- 例: `chore: Issueテンプレートを追加`

## PR
- タイトル: `Issue名（#番号）`（Issue名は、Issueのタイトルと完全に一致させる）
- 本文: `.github/pull_request_template.md` の4セクション（概要・実装内容・完了条件・関連issue）で書く
  - 関連issueには `close #番号` を書く
  - 「対応した問題」「デプロイ影響」は、該当する場合のみ追加する
- featureブランチのPRは、develop に向けて作成する
- マージはユーザー自身が行う。Claudeはマージしない
- マージ方法: feature→developはSquash、develop→mainはmerge commit

## アーキテクチャ方針
- バックエンドは Rails の API mode（画面を持たず、JSONだけを返す構成）で作る
- 認証は Devise のセッション認証（HttpOnly Cookie）を使う。JWTは使わない（理由は README の 5-3）
- Fat Controller・Fat Model（1つのクラスに処理を詰め込みすぎた状態）を避ける
  - 複数のモデルにまたがる処理や、外部サービスとのやり取りは、`app/services/` のServiceクラスに切り出す
  - Controllerは、リクエストの受け取りとレスポンスの返却に専念させる

## AI利用方針
- 設計判断（構成・ライブラリ・データ設計・方式の選択など）は、ユーザーが行う。Claudeは案と根拠を出す
- 判断の根拠（比較した案、選んだ理由、見送った理由）は、PR本文に残す

## プッシュ前のチェック
push の前に、変更した側（backend／frontend）について次を実行し、すべて通ることを確かめる。
失敗したまま push しない。結果はユーザーへの報告に含める。

| 対象 | チェック | コマンド |
|---|---|---|
| backend | RSpec（テスト） | #7 で追記 |
| backend | RuboCop（コードの書き方の検査） | #5 で追記 |
| backend | Brakeman（セキュリティの検査） | #6 で追記 |
| frontend | ESLint（コードの書き方の検査） | #9 で追記 |
| frontend | Vitest（テスト） | #10 で追記 |

コマンドが未確定のチェックは、導入されるまでスキップしてよい。
