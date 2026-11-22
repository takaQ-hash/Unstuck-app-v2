import { http, HttpResponse } from 'msw/http'

// テストで使う、APIのモックの一覧
// 接続先は、開発用のRailsサーバー（backend/CLAUDE.md の localhost:3000）に合わせる
export const handlers = [
  // Railsのヘルスチェック（/up）。起動していれば200を返す
  http.get('http://localhost:3000/up', () => {
    return new HttpResponse(null, { status: 200 })
  }),
]
