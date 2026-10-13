import { useState } from 'react'
import { steps } from '../data/wudu'

export default function StepsScreen({ viewedSteps, viewStep, onNavigate }) {
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const allViewed = viewedSteps.length >= steps.length

  function go(next) {
    const clamped = Math.max(0, Math.min(steps.length - 1, next))
    setIndex(clamped)
    viewStep(steps[clamped].id)
  }

  return (
    <div className="screen">
      <div className="screen__head">
        <h2 className="screen__title">💧 خطوات الوضوء بالترتيب</h2>
        <p className="screen__lead">
          استعرض الخطوات الثمانية واحدة تلو الأخرى. عند إتمامها ستحصل على نجمة!
        </p>
      </div>

      <div className="steps-view">
        <div className="steps-view__dots">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`الخطوة ${s.id}`}
              className={
                'dot' +
                (i === index ? ' dot--active' : '') +
                (viewedSteps.includes(s.id) ? ' dot--seen' : '')
              }
              onClick={() => {
                setIndex(i)
                viewStep(s.id)
              }}
            />
          ))}
        </div>

        <article className="step-card" key={step.id}>
          <div className="step-card__badge">الخطوة {step.id} من {steps.length}</div>
          <div className="step-card__emoji" aria-hidden="true">
            {step.emoji}
          </div>
          <h3 className="step-card__name">{step.name}</h3>
          <p className="step-card__text">{step.text}</p>
          <p className="step-card__detail">💡 {step.detail}</p>
        </article>

        <div className="steps-view__controls">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            ⏮ السابق
          </button>
          {index < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => go(index + 1)}
            >
              التالي ⏭
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigate('order')}
            >
              العب النشاط 🧩
            </button>
          )}
        </div>

        <p className="steps-view__counter">
          الخطوات المشاهدة: {viewedSteps.length}/{steps.length}
          {allViewed ? ' — أحسنت! 🎉' : ''}
        </p>
      </div>
    </div>
  )
}
