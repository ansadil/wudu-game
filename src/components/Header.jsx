const tabs = [
  { id: 'home', label: 'الرئيسية', emoji: '🏠' },
  { id: 'lesson', label: 'الدرس', emoji: '📖' },
  { id: 'steps', label: 'الخطوات', emoji: '💧' },
  { id: 'order', label: 'رتّب الخطوات', emoji: '🧩' },
  { id: 'quiz', label: 'الاختبار', emoji: '❓' },
  { id: 'bank', label: 'بنك الأسئلة', emoji: '🗂️' },
  { id: 'mosque', label: 'الرحلة للمسجد', emoji: '🕌' },
]

export default function Header({ screen, onNavigate, stars }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          💧
        </span>
        <div>
          <h1 className="header__title">وضوئي الصحيح</h1>
          <p className="header__subtitle">الدراسات الإسلامية • الصف الرابع</p>
        </div>
      </div>

      <div className="stars" title="نجومك">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className={i < stars ? 'star star--on' : 'star'}
            aria-hidden="true"
          >
            ⭐
          </span>
        ))}
        <span className="stars__count">{stars}/7</span>
      </div>

      <nav className="nav" aria-label="التنقل">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={screen === t.id ? 'nav__btn nav__btn--active' : 'nav__btn'}
            onClick={() => onNavigate(t.id)}
          >
            <span aria-hidden="true">{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}
