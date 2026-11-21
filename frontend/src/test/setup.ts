import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// globals を使わないため、Testing Library の後片付けは自動では動かない。
// テストごとに、描画した画面を消す
afterEach(() => {
  cleanup()
})
