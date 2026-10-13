import { useEffect, useState } from 'react'
import { mcqBank, pickRandom, prepareMcq } from '../data/bank'

const EXAM = 10

export default function QuizScreen({ setQuizBest, onNavigate }) {
  const [questions, setQuestions] = useState(() =>
    pickRandom(mcqBank, EXAM).map(prepareMcq),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answered = selected !== null
  const passed = score >= 8

  useEffect(() => {
    if (finished) setQuizBest(score)
  }, [finished, score, setQuizBest])

  function choose(i) {
    if (answered) return
    setSelected(i)
    if (i === question.answer) setScore((s) => s + 1)
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
    setQuestions(pickRandom(mcqBank, EXAM).map(prepareMcq))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <div className="screen">
        <section className="panel panel--success score">
          <div className="score__emoji" aria-hidden="true">
            {percent === 100 ? '🏆' : percent >= 80 ? '🎉' : '💪'}
          </div>
          <h2 className="score__title">
            {percent === 100
              ? 'ممتاز! علامة كاملة'
              : percent >= 80
                ? 'أحسنت! نتيجة رائعة'
                : 'محاولة جيدة، تدرّب أكثر'}
          </h2>
          <p className="score__value">
            {score} / {questions.length}
          </p>
          <p className="score__percent">نسبتك: {percent}%</p>
          <p className="muted">
            {passed
              ? 'لقد أتقنت درس الوضوء! نلت نجمة الاختبار ⭐'
              : 'تحتاج 8 إجابات صحيحة على الأقل لنيل النجمة. أعد المحاولة!'}
          </p>
          <div className="screen__footer">
            <button type="button" className="btn btn--ghost" onClick={restart}>
              🔄 أعد الاختبار
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigate('home')}
            >
              🏠 الرئيسية
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="screen__head">
        <h2 className="screen__title">❓ اختبار الوضوء</h2>
        <p className="screen__lead">
          عشرة أسئلة عشوائية من بنك الأسئلة. تحتاج 8 إجابات صحيحة لنيل النجمة.
        </p>
      </div>

      <div className="quiz-progress">
        <div
          className="quiz-progress__bar"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p className="muted">
        السؤال {index + 1} من {questions.length} • النقاط: {score}
      </p>

      <section className="panel">
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
          <p
            className={
              selected === question.answer
                ? 'feedback feedback--ok'
                : 'feedback feedback--bad'
            }
          >
            {selected === question.answer
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
