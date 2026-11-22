import { describe, expect, it } from 'vitest'

// MSWの使い方を示すサンプルのテスト。
// アプリのコードではなく、src/mocks/handlers.ts のモックが応答することを確かめる。
// APIを呼ぶコードができたら、そのコードのテストでMSWを使う
describe('ヘルスチェックのモック（サンプル）', () => {
  it('GET /up に200を返す', async () => {
    const response = await fetch('http://localhost:3000/up')

    expect(response.status).toBe(200)
  })
})
