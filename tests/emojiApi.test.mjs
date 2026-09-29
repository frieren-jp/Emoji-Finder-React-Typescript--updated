import assert from 'node:assert/strict'
import test from 'node:test'
import { getEmojis } from '../src/api/emojiApi.ts'

const item = { emoji: '🔥', title: 'Fire', keywords: 'hot flame' }

test('passes encoded query and cancellation signal to the server', async (t) => {
  const signal = new AbortController().signal
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url.origin + url.pathname, 'http://localhost:3000/api/emojis')
    assert.equal(url.searchParams.get('q'), 'fire & flame')
    assert.equal(options.signal, signal)
    return Response.json([item])
  })
  assert.deepEqual(await getEmojis(' fire & flame ', signal), [item])
})

test('returns an empty result unchanged', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json([]))
  assert.deepEqual(await getEmojis(), [])
})

test('rejects HTTP errors', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }))
  await assert.rejects(getEmojis(), /HTTP 503/)
})

test('rejects malformed response data', async (t) => {
  for (const data of [{ results: [item] }, [{ ...item, emoji: 7 }], [null]]) {
    const stub = t.mock.method(globalThis, 'fetch', async () => Response.json(data))
    await assert.rejects(getEmojis(), /Invalid emoji response/)
    stub.mock.restore()
  }
})

test('propagates network failure and cancellation', async (t) => {
  for (const error of [new TypeError('Failed to fetch'), new DOMException('Aborted', 'AbortError')]) {
    const stub = t.mock.method(globalThis, 'fetch', async () => { throw error })
    await assert.rejects(getEmojis(), (actual) => actual === error)
    stub.mock.restore()
  }
})
