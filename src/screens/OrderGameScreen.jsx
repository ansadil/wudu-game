import { useEffect, useMemo, useState } from 'react'
import { steps } from '../data/wudu'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function OrderGameScreen({ setOrderBest, onNavigate }) {
  const [pool, setPool] = useState(() => shuffle(steps))
  const [placed, setPlaced] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const buttonById = useMemo(
    () => Object.fromEntries(steps.map((s) => [s.id, s])),
    [],
  )

  const done = placed.length === steps.length
  const score = Math.max(0, steps.length - mistakes)

  useEffect(() => {
    if (done) setOrderBest(score)
  }, [done, score, setOrderBest])

  function handlePick(step) {
    if (done) return
    const expected = placed.length + 1
    if (step.id === expected) {
      setPlaced((p) => [...p, step.id])
      setPool((p) => p.filter((s) => s.id !== step.id))
      setFeedback({ type: 'ok', text: `أحسنت! ${step.name} هي الخطوة رقم ${expected} ✅` })
    } else {
      setMistakes((m) => m + 1)
      setFeedback({
        type: 'bad',
        text: `ليست الخطوة ${expected}. فكّر قليلاً ثم جرّب مرة أخرى 🤔`,
      })
    }
  }

  function restart() {
    setPool(shuffle(steps))
    setPlaced([])
    setMistakes(0)
    setFeedback(null)
  }

  return (
    <div className="screen">
      <div className="screen__head">
        <h2 className="screen__title">🧩 رتّب خطوات الوضوء</h2>
        <p className="screen__lead">
          اضغط على الخطوة الصحيحة بالترتيب من 1 إلى 8. كل خطأ ينقص علامتك قليلاً.
        </p>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h3 className="panel__title">الخطوات المطلوبة</h3>
          <span className="badge">الأخطاء: {mistakes}</span>
        </div>
        <ol className="order-slots">
          {steps.map((s, i) => {
            const filled = placed[i]
            return (
              <li
                key={s.id}
                className={filled ? 'order-slot order-slot--filled' : 'order-slot'}
              >
                <span className="order-slot__num">{i + 1}</span>
                <span className="order-slot__label">
                  {filled ? buttonById[filled].name : '—'}
                </span>
                {filled && <span aria-hidden="true">{buttonById[filled].emoji}</span>}
              </li>
            )
          })}
        </ol>
      </section>

      <section className="panel">
        <h3 className="panel__title">اختر الخطوة التالية</h3>
        <div className="chips">
          {pool.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip-btn"
              onClick={() => handlePick(s)}
            >
              <span aria-hidden="true">{s.emoji}</span>
              {s.name}
            </button>
          ))}
          {pool.length === 0 && <p className="muted">لا توجد خطوات متبقية 🎉</p>}
        </div>

        {feedback && (
          <p className={feedback.type === 'ok' ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
            {feedback.text}
          </p>
        )}
      </section>

      {done && (
        <section className="panel panel--success">
          <h3 className="panel__title">🎉 رائع! رتّبت كل الخطوات</h3>
          <p className="muted">
            نتيجتك: {score}/{steps.length} — عدد الأخطاء: {mistakes}
          </p>
          <div className="screen__footer">
            <button type="button" className="btn btn--ghost" onClick={restart}>
              🔄 العب مرة أخرى
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigate('quiz')}
            >
              إلى الاختبار ❓
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
