import { useState } from 'react'
import { mcqBank, prepareMcq, shuffle, topics } from '../data/bank'

function build(topic) {
  const pool = topic === 'الكل' ? mcqBank : mcqBank.filter((q) => q.topic === topic)
  return shuffle(pool).map(prepareMcq)
}

export default function McqPractice() {
  const [topic, setTopic] = useState('الكل')
  const [questions, setQuestions] = useState(() => build('الكل'))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answered = selected !== null
  const isRight = answered && selected === question.answer
  const percent = questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0

  function changeTopic(t) {
    setTopic(t)
    setQuestions(build(t))
    setIndex(0)
    setSelected(null)
    setCorrect(0)
    setFinished(false)
  }

  function choose(i) {
    if (answered) return
    setSelected(i)
    if (i === question.answer) setCorrect((c) => c + 1)
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setQuestions(build(topic))
    setIndex(0)
    setSelected(null)
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
          {percent === 100
            ? 'ممتاز! تدريب كامل'
            : percent >= 80
              ? 'أحسنت! نتيجة رائعة'
              : 'محاولة جيدة، واصل التدريب'}
        </h3>
        <p className="score__value">
          {correct} / {questions.length}
        </p>
        <p className="score__percent">نسبتك: {percent}%</p>
        <div className="screen__footer">
          <button type="button" className="btn btn--primary" onClick={restart}>
            🔄 أعد التدريب
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bank-practice">
      <div className="chips">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            className={t === topic ? 'chip-btn chip-btn--active' : 'chip-btn'}
            onClick={() => changeTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="quiz-progress">
        <div
          className="quiz-progress__bar"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p className="muted">
        السؤال {index + 1} من {questions.length} • الإجابات الصحيحة: {correct}
      </p>

      <section className="panel">
        <span className="chip">{question.topic}</span>
        <h3 className="quiz-q">{question.q}</h3>
        <div className="quiz-options">
          {question.options.map((opt, i) => {
            let cls = 'option'
            if (answered && i === question.answer) cls += ' option--correct'
            if (answered && i === selected && i !== question.answer)
              cls += ' option--wrong'
            return (
              <button
                key={opt}
                type="button"
                className={cls}
                disabled={answered}
                onClick={() => choose(i)}
              >
                <span className="option__mark">{['أ', 'ب', 'ج', 'د'][i]}</span>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <p className={isRight ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
            {isRight
              ? 'إجابة صحيحة! ✅'
              : `إجابة غير صحيحة. الإجابة الصحيحة: ${question.options[question.answer]}`}
          </p>
        )}

        <div className="screen__footer">
          <button
            type="button"
            className="btn btn--primary"
            disabled={!answered}
            onClick={next}
          >
            {index + 1 < questions.length ? 'السؤال التالي ⏭' : 'اعرض النتيجة 🏁'}
          </button>
        </div>
      </section>
    </div>
  )
}
