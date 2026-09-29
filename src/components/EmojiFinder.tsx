import { useEffect, useState } from 'react'
import { getEmojis, type EmojiItem } from '../api/emojiApi'

type SearchState =
  | { status: 'loading' }
  | { status: 'success'; emojis: EmojiItem[] }
  | { status: 'error' }

function EmojiCard({ item }: { item: EmojiItem }) {
  return (
    <article className="emoji-card">
      <span className="emoji-card__symbol" role="img" aria-label={item.title}>{item.emoji}</span>
      <h2 className="emoji-card__title">{item.title}</h2>
      <p className="emoji-card__keywords">{item.keywords}</p>
    </article>
  )
}

export default function EmojiFinder() {
  const [query, setQuery] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<SearchState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    getEmojis(query, controller.signal)
      .then((emojis) => {
        if (!controller.signal.aborted) setState({ status: 'success', emojis })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error' })
      })
    return () => controller.abort()
  }, [query, attempt])

  return (
    <main className="content">
      <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="visually-hidden" htmlFor="emoji-search">Find emoji by keywords</label>
        <input id="emoji-search" type="search" placeholder="Placeholder" autoComplete="off"
          value={query} onChange={(event) => { setQuery(event.target.value); setState({ status: 'loading' }) }} />
      </form>
      {state.status === 'loading' && <p className="empty-state" role="status">Загрузка...</p>}
      {state.status === 'error' && (
        <div className="error-state">
          <p role="alert">Не удалось загрузить данные. Проверьте, запущен ли сервер (start.bat).</p>
          <button type="button" onClick={() => { setAttempt((value) => value + 1); setState({ status: 'loading' }) }}>Повторить запрос</button>
        </div>
      )}
      {state.status === 'success' && (
        <>
          <section className="emoji-grid" aria-label="Emoji search results">
            {state.emojis.map((item) => <EmojiCard key={`${item.title}:${item.emoji}`} item={item} />)}
            {state.emojis.length === 0 && <p className="empty-state" role="status">Эмодзи не найдены</p>}
          </section>
          <p className="visually-hidden" role="status">Найдено эмодзи: {state.emojis.length}</p>
        </>
      )}
    </main>
  )
}
