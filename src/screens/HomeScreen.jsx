import { aboutCards, intro } from '../data/wudu'

export default function HomeScreen({ onNavigate, stars, progress, onReset }) {
  const achievements = [
    { id: 'lesson', emoji: '📖', label: 'قرأت الدرس', done: progress.lessonRead },
    {
      id: 'steps',
      emoji: '💧',
      label: 'استعرضت الخطوات',
      done: progress.viewedSteps.length >= 8,
    },
    {
      id: 'order',
      emoji: '🧩',
      label: 'رتّبت الخطوات',
      done: progress.orderBest >= 6,
    },
    {
      id: 'quiz',
      emoji: '🏆',
      label: 'أنهيت الاختبار',
      done: progress.quizBest >= 8,
    },
    {
      id: 'tf',
      emoji: '✅',
      label: 'أتقنت صح أم خطأ',
      done: progress.tfBest >= 80,
    },
    {
      id: 'match',
      emoji: '🔗',
      label: 'أتقنت التوصيل',
      done: progress.matchBest >= 80,
    },
    {
      id: 'mosque',
      emoji: '🕌',
      label: 'وصلت إلى المسجد',
      done: progress.mosqueDone,
    },
  ]

  return (
    <div className="screen">
      <section className="hero-card">
        <div className="hero-card__emoji" aria-hidden="true">
          🤲💧
        </div>
        <p className="chip">{intro.subject} • {intro.grade}</p>
        <h2 className="hero-card__welcome">{intro.welcome}</h2>
        <p className="hero-card__message">{intro.message}</p>
        <div className="hero-card__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onNavigate('lesson')}
          >
            ابدأ الدرس 🚀
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onNavigate('quiz')}
          >
            جرّب الاختبار ✅
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onNavigate('bank')}
          >
            بنك الأسئلة 🗂️
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onNavigate('mosque')}
          >
            الرحلة إلى المسجد 🕌
          </button>
        </div>
      </section>

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
        <div className="panel__head">
          <h3 className="panel__title">إنجازاتك 🎯</h3>
          <span className="badge">{stars}/7 نجوم</span>
        </div>
        <ul className="achievements">
          {achievements.map((a) => (
            <li
              key={a.id}
              className={a.done ? 'achievement achievement--done' : 'achievement'}
            >
              <span className="achievement__emoji" aria-hidden="true">
                {a.done ? '✅' : a.emoji}
              </span>
              <span>{a.label}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--link" onClick={onReset}>
          إعادة تعيين التقدم
        </button>
      </section>

      <footer className="home-footer">
        <p className="home-footer__row">
          <span className="home-footer__label">الطالبة</span>
          <span className="home-footer__value">رحمة عادل الصاعدي</span>
        </p>
        <p className="home-footer__row">
          <span className="home-footer__label">المعلمة</span>
          <span className="home-footer__value">عزيزة العوفي</span>
        </p>
        <p className="home-footer__school">المدرسة الثانية والأربعون الابتدائية</p>
      </footer>
    </div>
  )
}
