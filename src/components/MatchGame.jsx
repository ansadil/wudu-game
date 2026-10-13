import { useEffect, useRef, useState } from 'react'
import { matchBank, shuffle } from '../data/bank'

function buildSet(set) {
  return {
    title: set.title,
    left: shuffle(set.pairs.map((p, i) => ({ id: i, text: p.left }))),
    right: shuffle(set.pairs.map((p, i) => ({ id: i, text: p.right }))),
    total: set.pairs.length,
  }
}

export default function MatchGame({ setMatchBest }) {
  const [setIndex, setSetIndex] = useState(() =>
    Math.floor(Math.random() * matchBank.length),
  )
  const [game, setGame] = useState(() => buildSet(matchBank[setIndex]))
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [solved, setSolved] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [flash, setFlash] = useState(null)
  const timer = useRef(null)

  const finished = solved.length === game.total && game.total > 0
  const percent = finished
    ? Math.round((game.total / (game.total + mistakes)) * 100)
    : 0

  useEffect(() => {
    if (finished) setMatchBest(percent)
  }, [finished, percent, setMatchBest])

  useEffect(() => () => clearTimeout(timer.current), [])

  function startSet(i) {
    clearTimeout(timer.current)
    setSetIndex(i)
    setGame(buildSet(matchBank[i]))
    setSelectedLeft(null)
    setSolved([])
    setMistakes(0)
    setFlash(null)
  }

  function newRound() {
    let i = setIndex
    if (matchBank.length > 1) {
      while (i === setIndex) i = shuffle(matchBank.map((_, j) => j))[0]
    }
    startSet(i)
  }

  function pickLeft(id) {
    if (solved.includes(id)) return
    setSelectedLeft(id)
    setFlash(null)
  }

  function pickRight(id) {
    if (solved.includes(id) || selectedLeft === null) return
    if (id === selectedLeft) {
      setSolved((s) => [...s, id])
      setSelectedLeft(null)
      setFlash({ left: id, right: id, ok: true })
    } else {
      setMistakes((m) => m + 1)
      setFlash({ left: selectedLeft, right: id, ok: false })
      setSelectedLeft(null)
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setFlash(null), 700)
  }

  return (
    <div className="bank-practice">
      <div className="chips">
        {matchBank.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className={i === setIndex ? 'chip-btn chip-btn--active' : 'chip-btn'}
            onClick={() => startSet(i)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <section className="panel">
        <div className="panel__head">
          <h3 className="panel__title">{game.title}</h3>
          <span className="badge">
            الأخطاء: {mistakes} • المتصل: {solved.length}/{game.total}
          </span>
        </div>
        <p className="muted">
          اختر بطاقة من العمود الأيمن ثم اختر ما يناسبها من العمود الأيسر.
        </p>

        <div className="match-grid">
          <div className="match-col">
            {game.right.map((r) => {
              const isSolved = solved.includes(r.id)
              const isFlash = flash && flash.right === r.id
              let cls = 'match-card'
              if (isSolved) cls += ' match-card--solved'
              if (isFlash) cls += flash.ok ? ' match-card--ok' : ' match-card--bad'
              return (
                <button
                  key={r.id}
                  type="button"
                  className={cls}
                  disabled={isSolved}
                  onClick={() => pickRight(r.id)}
                >
                  {r.text}
                </button>
              )
            })}
          </div>
          <div className="match-col">
            {game.left.map((l) => {
              const isSolved = solved.includes(l.id)
              const isActive = selectedLeft === l.id
              const isFlash = flash && flash.left === l.id
              let cls = 'match-card'
              if (isSolved) cls += ' match-card--solved'
              if (isActive) cls += ' match-card--active'
              if (isFlash) cls += flash.ok ? ' match-card--ok' : ' match-card--bad'
              return (
                <button
                  key={l.id}
                  type="button"
                  className={cls}
                  disabled={isSolved}
                  onClick={() => pickLeft(l.id)}
                >
                  {l.text}
                </button>
              )
            })}
          </div>
        </div>

        {finished && (
          <div className="panel panel--success score" style={{ marginTop: 16 }}>
            <div className="score__emoji" aria-hidden="true">
              {percent >= 80 ? '🎉' : '💪'}
            </div>
            <h3 className="score__title">أكملت المجموعة!</h3>
            <p className="score__percent">
              دقتك: {percent}% • عدد الأخطاء: {mistakes}
            </p>
            <p className="muted">
              {percent >= 80
                ? 'نلت نجمة التوصيل ⭐'
                : 'تحتاج دقة 80% على الأقل لنيل النجمة.'}
            </p>
            <div className="screen__footer">
              <button type="button" className="btn btn--primary" onClick={newRound}>
                🔄 مجموعة أخرى
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
