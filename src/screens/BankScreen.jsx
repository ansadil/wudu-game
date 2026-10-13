import { useState } from 'react'
import McqPractice from '../components/McqPractice'
import TrueFalseGame from '../components/TrueFalseGame'
import MatchGame from '../components/MatchGame'
import { mcqBank, matchBank, tfBank } from '../data/bank'

const tabs = [
  { id: 'mcq', label: 'اختيار من متعدد', emoji: '📝' },
  { id: 'tf', label: 'صح أم خطأ', emoji: '✅' },
  { id: 'match', label: 'التوصيل', emoji: '🔗' },
]

export default function BankScreen({ setTfBest, setMatchBest, onNavigate }) {
  const [tab, setTab] = useState('mcq')

  return (
    <div className="screen">
      <div className="screen__head">
        <h2 className="screen__title">🗂️ بنك الأسئلة</h2>
        <p className="screen__lead">
          تدرّب على {mcqBank.length} سؤال اختيار من متعدد، و{tfBank.length} عبارة
          صح أو خطأ، و{matchBank.length} مجموعات توصيل — مستخرجة من أسئلة المنهج.
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="أنواع الأسئلة">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'tab tab--active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden="true">{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'mcq' && <McqPractice />}
      {tab === 'tf' && <TrueFalseGame setTfBest={setTfBest} />}
      {tab === 'match' && <MatchGame setMatchBest={setMatchBest} />}

      <div className="screen__footer">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onNavigate('quiz')}
        >
          إلى الاختبار الرسمي ❓
        </button>
      </div>
    </div>
  )
}
