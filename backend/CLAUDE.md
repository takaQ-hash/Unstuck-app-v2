# backend/CLAUDE.md

バックエンド（Rails）のコマンドと、開発環境の注意。共通のルールは、リポジトリのルートの CLAUDE.md を参照する。

## コマンド
ホストにRubyは入れていないため、Dockerの `ruby:4.0.7` イメージで実行する。
compose.yml は #12・#13 で整備する。それまでは次の形で一時的に起動する。
コマンドは、リポジトリのルートで実行する（`-v "$PWD":/app` がルートを前提にしているため）。
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

# RuboCop（指摘0件で終わればOK。自動修正は rubocop -a）
docker run --rm -v "$PWD":/app -w /app/backend -v unstuck_bundle:/usr/local/bundle \
  ruby:4.0.7 bash -c 'bundle install && bundle exec rubocop'
# Brakeman（Security Warnings 0件でOK。無視する警告は config/brakeman.ignore の note に理由を書く）
docker run --rm -v "$PWD":/app -w /app/backend -v unstuck_bundle:/usr/local/bundle ruby:4.0.7 bash -c 'bundle install && bundle exec brakeman --no-pager'
# RSpec（一時的なPostgreSQLコンテナを立てて実行し、終了時に削除する。引数はrspecに渡す）
scripts/backend-rspec.sh
```

## 開発環境の注意

### Dockerコマンド
- `-it` を付けない（Claude Codeには対話できる端末が無く、コマンドが止まってしまうため）
- 複数のコマンドは `bash -c '...'` にまとめて実行する
- コンテナ内で作られたファイルは root の所有になる。コンテナ内で `chown -R $HOST_UID:$HOST_GID <対象>` を実行し、所有者を戻す
  （`docker run` に `-e HOST_UID=$(id -u) -e HOST_GID=$(id -g)` を渡しておく）

### `/up` とPostgreSQL
- 開発環境の `/up`（Railsのヘルスチェック用のURL）は、PostgreSQLが起動していないと500を返す
- `/up` を確認するときは、先にPostgreSQLを起動する（開発用の compose.yml は #12 で用意する）
