import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/server.ts'

// MSWのサーバーを起動する。ハンドラーの無い通信が起きたら、テストを失敗させる
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

afterEach(() => {
  // globals を使わないため、Testing Library の後片付けは自動では動かない。
  // テストごとに、描画した画面を消す
  cleanup()
  // テストの中で足したハンドラーを、テストごとに元に戻す
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
