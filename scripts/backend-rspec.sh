#!/usr/bin/env bash
# バックエンドのRSpecを、一時的なPostgreSQLコンテナと一緒に実行する。
# - PostgreSQLは外に公開しない（-p を付けない）。終了時（失敗・中断を含む）に、コンテナとネットワークを削除する
# - 引数は rspec に渡す（例: scripts/backend-rspec.sh spec/requests）
# - compose.yml（#12・#13）ができたら、そちらでの実行に置き換える
set -euo pipefail

cd "$(dirname "$0")/.."

NETWORK=unstuck-test
PG_CONTAINER=unstuck-pg-test
PG_IMAGE=postgres:18
RUBY_IMAGE=ruby:4.0.7

cleanup() {
  docker rm -f "$PG_CONTAINER" >/dev/null 2>&1 || true
  docker network rm "$NETWORK" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# 前回の実行の残りがあれば消す
cleanup

docker network create "$NETWORK" >/dev/null
# 使い捨てで外に公開しないため、パスワードは固定値にする
docker run -d --name "$PG_CONTAINER" --network "$NETWORK" \
  -e POSTGRES_PASSWORD=postgres "$PG_IMAGE" >/dev/null

# 起動を待つ（初期化中の一時サーバーはTCPを受け付けないため、127.0.0.1で確認する）
for _ in $(seq 1 30); do
  if docker exec "$PG_CONTAINER" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$PG_CONTAINER" pg_isready -h 127.0.0.1 -U postgres >/dev/null || {
  echo "PostgreSQLが30秒以内に起動しませんでした" >&2
  exit 1
}

docker run --rm --network "$NETWORK" \
  -v "$PWD":/app -w /app/backend -v unstuck_bundle:/usr/local/bundle \
  -e RAILS_ENV=test \
  -e DATABASE_URL="postgres://postgres:postgres@$PG_CONTAINER/backend_test" \
  -e HOST_UID="$(id -u)" -e HOST_GID="$(id -g)" \
  "$RUBY_IMAGE" bash -c '
    bundle install >/dev/null && bin/rails db:prepare && bundle exec rspec "$@"
    status=$?
    chown -R "$HOST_UID:$HOST_GID" /app/backend
    exit $status
  ' _ "$@"
