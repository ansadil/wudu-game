import { useEffect } from 'react'
import { aboutCards, dua, rules, steps } from '../data/wudu'

export default function LessonScreen({ onNavigate, markLessonRead }) {
  useEffect(() => {
    markLessonRead()
  }, [markLessonRead])

  return (
    <div className="screen">
      <div className="screen__head">
        <h2 className="screen__title">📖 درس الوضوء</h2>
        <p className="screen__lead">
          اقرأ الدرس جيداً، ثم انتقل لاستعراض خطوات الوضوء بالترتيب.
        </p>
      </div>

      <section className="grid">
        {aboutCards.map((c) => (
          <article key={c.title} className="card">
            <div className="card__emoji" aria-hidden="true">
              {c.emoji}
            </div>
            <h3 className="card__title">{c.title}</h3>
            <p className="card__text">{c.text}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <h3 className="panel__title">📌 فوائد وضوابط الوضوء</h3>
        <ul className="list">
          {rules.map((r) => (
            <li key={r} className="list__item">
              <span aria-hidden="true">🔹</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel--peach">
        <h3 className="panel__title">🕋 {dua.title}</h3>
        <p className="dua">{dua.text}</p>
      </section>

      <section className="panel">
        <h3 className="panel__title">📝 ملخّص الخطوات</h3>
        <ol className="summary">
          {steps.map((s) => (
            <li key={s.id} className="summary__item">
              <span className="summary__num">{s.id}</span>
              <span>{s.name}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="screen__footer">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onNavigate('steps')}
        >
          التالي: خطوات الوضوء 💧
        </button>
      </div>
    </div>
  )
}
