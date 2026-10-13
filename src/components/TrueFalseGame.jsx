import { useEffect, useState } from 'react'
import { pickRandom, tfBank } from '../data/bank'

const ROUND = 10

export default function TrueFalseGame({ setTfBest }) {
  const [round, setRound] = useState(() => pickRandom(tfBank, ROUND))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  const item = round[index]
  const isRight = picked !== null && picked === item.answer
  const percent = Math.round((correct / round.length) * 100)

  useEffect(() => {
    if (finished) setTfBest(percent)
  }, [finished, percent, setTfBest])

  function answer(value) {
    if (picked !== null) return
    setPicked(value)
    if (value === item.answer) setCorrect((c) => c + 1)
  }

  function next() {
    if (index + 1 < round.length) {
      setIndex((i) => i + 1)
      setPicked(null)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setRound(pickRandom(tfBank, ROUND))
    setIndex(0)
    setPicked(null)
    setCorrect(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="panel panel--success score">
        <div className="score__emoji" aria-hidden="true">
          {percent === 100 ? '🏆' : percent >= 80 ? '🎉' : '💪'}
        </div>
        <h3 className="score__title">
          {percent >= 80 ? 'أحسنت! حكم صحيح' : 'محاولة جيدة، أعد المحاولة'}
        </h3>
        <p className="score__value">
          {correct} / {round.length}
        </p>
        <p className="score__percent">نسبتك: {percent}%</p>
        <p className="muted">
          {percent >= 80
            ? 'نلت نجمة «صح أم خطأ» ⭐'
            : 'تحتاج 80% على الأقل لنيل النجمة.'}
        </p>
        <div className="screen__footer">
          <button type="button" className="btn btn--primary" onClick={restart}>
            🔄 جولة جديدة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bank-practice">
      <div className="quiz-progress">
        <div
          className="quiz-progress__bar"
          style={{ width: `${((index + 1) / round.length) * 100}%` }}
        />
      </div>
      <p className="muted">
        العبارة {index + 1} من {round.length} • الإجابات الصحيحة: {correct}
      </p>

      <section className="panel">
        <h3 className="quiz-q">هل هذه العبارة صحيحة؟</h3>
        <p className="tf-statement">{item.text}</p>

        <div className="tf-actions">
          <button
            type="button"
            className={
              picked === true
                ? item.answer
                  ? 'tf-btn tf-btn--ok'
                  : 'tf-btn tf-btn--bad'
                : 'tf-btn'
            }
            disabled={picked !== null}
            onClick={() => answer(true)}
          >
            ✅ صح
          </button>
          <button
            type="button"
            className={
              picked === false
                ? !item.answer
                  ? 'tf-btn tf-btn--ok'
                  : 'tf-btn tf-btn--bad'
                : 'tf-btn'
            }
            disabled={picked !== null}
            onClick={() => answer(false)}
          >
            ❌ خطأ
          </button>
        </div>

        {picked !== null && (
          <p className={isRight ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
            {isRight ? 'إجابة صحيحة! ✅ ' : 'إجابة غير صحيحة. '}
            العبارة {item.answer ? 'صحيحة' : 'خاطئة'}
            {item.explain ? ` — ${item.explain}` : '.'}
          </p>
        )}

        <div className="screen__footer">
          <button
            type="button"
            className="btn btn--primary"
            disabled={picked === null}
            onClick={next}
          >
            {index + 1 < round.length ? 'العبارة التالية ⏭' : 'اعرض النتيجة 🏁'}
          </button>
        </div>
      </section>
    </div>
  )
}
