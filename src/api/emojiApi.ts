export interface EmojiItem {
  emoji: string
  title: string
  keywords: string
}

const API_URL = 'http://localhost:3000/api/emojis'

function isEmojiItem(value: unknown): value is EmojiItem {
  return typeof value === 'object' && value !== null
    && 'emoji' in value && typeof value.emoji === 'string'
    && 'title' in value && typeof value.title === 'string'
    && 'keywords' in value && typeof value.keywords === 'string'
}

export async function getEmojis(query = '', signal?: AbortSignal): Promise<EmojiItem[]> {
  const url = new URL(API_URL)
  url.searchParams.set('q', query.trim())
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Emoji API returned HTTP ${response.status}`)
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isEmojiItem)) throw new Error('Invalid emoji response')
  return data
}
