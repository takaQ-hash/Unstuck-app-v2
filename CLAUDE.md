# CLAUDE.md

## プロジェクト概要
Unstuck-app v2。React（frontend/）＋ Rails API（backend/）のモノレポ。
※バージョン: Ruby 4.0 / Rails 8.1（API mode）  
詳細は README.md と docs/er-diagram.md を参照する。

## 基本方針
- 1 Issue = 1 PR とする
- 実装前に `gh issue view <番号>` でIssueを読み、タスクと受け入れ条件を仕様として実装する
- Issueの範囲外の変更はしない。必要だと思った場合は、実装せず提案にとどめる
- 不明点や、方法が複数ある場合は、推測で進めず、案を提示してユーザーに確認する
- 返答、コミットメッセージの本文、PR本文は日本語で書く

## 作業の流れ
1. developを最新にして、ブランチを作成する
2. 実装する（タスクのチェック項目1つ＝1コミットを目安に区切る）
3. 実装後、変更内容と確認方法をユーザーに報告する
4. ユーザーが確認する。問題なければコミット、修正があれば再実装する

## 実行前に必ずユーザーの確認が必要な操作
- コミット、push、PR作成（ユーザーが指示するまで実行しない）
- 依存パッケージの追加・更新、DBマイグレーションの実行

## 禁止事項
- PRのマージ（マージは必ずユーザー自身が行う）
- force push、develop・mainへの直接push
- `.env`などのシークレットの読み取り・コミット

## ブランチ名
`feat/`、`fix/`、`chore/`、`docs/` のいずれかで始める（developから作成）。
例: `chore/add-claude-md`

## コミット
Conventional Commits。prefixは英語、本文は日本語。
例: `chore: Issueテンプレートを追加`

## PR
- タイトル: `Issue名（#番号）`（Issue名は、Issueのタイトルと完全に一致させる）
- 本文: 概要・実装内容・完了条件・関連issue（`close #番号`）。
  「対応した問題」「デプロイ影響」は該当する場合のみ追加する
- マージ方法: feature→developはSquash、develop→mainはmerge commit

## （M0-17で追記予定）
テスト・Lint・CIのコマンド、ディレクトリ構成、アーキテクチャ方針
