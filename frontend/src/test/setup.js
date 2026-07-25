import '@testing-library/jest-dom/vitest'
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web'
import { TextDecoder, TextEncoder } from 'node:util'
import { BroadcastChannel } from 'node:worker_threads'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

Object.assign(globalThis, {
  BroadcastChannel: globalThis.BroadcastChannel ?? BroadcastChannel,
  ReadableStream: globalThis.ReadableStream ?? ReadableStream,
  TextDecoder: globalThis.TextDecoder ?? TextDecoder,
  TextEncoder: globalThis.TextEncoder ?? TextEncoder,
  TransformStream: globalThis.TransformStream ?? TransformStream,
  WritableStream: globalThis.WritableStream ?? WritableStream,
})

// MSW reads the Web Streams globals while its modules are evaluated, so it
// must be imported after the jsdom environment has received the Node polyfills.
const { server } = await import('./msw/server.js')

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
