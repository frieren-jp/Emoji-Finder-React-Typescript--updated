import EmojiFinder from './components/EmojiFinder'
import './App.css'

export default function App() {
  return (
    <>
      <header className="hero">
        <h1>Emoji Finder</h1>
        <p>Find emoji by keywords</p>
      </header>
      <EmojiFinder />
    </>
  )
}
