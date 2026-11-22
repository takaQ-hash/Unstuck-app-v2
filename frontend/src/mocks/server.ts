import { setupServer } from 'msw/node'
import { handlers } from './handlers.ts'

// Node上で動くテストの通信を横取りし、handlers の応答を返すサーバー
export const server = setupServer(...handlers)
