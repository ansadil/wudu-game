import { useEffect, useRef, useState } from 'react'
import { createMosqueGame, STOPS } from '../game/mosqueGame'
import { mcqBank, prepareMcq, shuffle } from '../data/bank'
import { playCorrect, playWrong, playWin, playStep, isMuted, toggleMuted } from '../game/sound'

function buildPool() {
  return shuffle(mcqBank).map(prepareMcq)
}

function WalkToMosque({ setMosqueDone, onBack, onRestart }) {
  const mountRef = useRef(null)
  const engineRef = useRef(null)
  const sceneRef = useRef(null)
  const screenRef = useRef(null)
  const poolRef = useRef([])
  const timerRef = useRef(null)
  const flashTimerRef = useRef(null)

  const [question, setQuestion] = useState(null)
  const [station, setStation] = useState(0)
  const [answerState, setAnswerState] = useState(null)
  const [picked, setPicked] = useState(null)
  const [won, setWon] = useState(false)
  const [intro, setIntro] = useState(true)
  const [flash, setFlash] = useState(null)
  const [muted, setMuted] = useState(isMuted())
  const [isFull, setIsFull] = useState(false)
  const [mustRotate, setMustRotate] = useState(false)

  useEffect(() => {
    poolRef.current = buildPool()
    const engine = createMosqueGame(mountRef.current, {
      onStation: (i) => {
        setStation(i + 1)
        setAnswerState(null)
        setPicked(null)
        if (poolRef.current.length === 0) poolRef.current = buildPool()
        setQuestion(poolRef.current.pop())
      },
      onFinish: () => {
        setWon(true)
        setQuestion(null)
        setAnswerState(null)
        setMosqueDone(true)
        playWin()
      },
      onStep: (alt) => playStep(alt),
      onBoardRect: (rect) => {
        const el = screenRef.current
        if (!el || !rect) return
        el.style.left = `${rect.left}px`
        el.style.top = `${rect.top}px`
        el.style.width = `${rect.width}px`
        el.style.height = `${rect.height}px`
        el.style.setProperty('--ss', `${rect.width}px`)
      },
    })
    engineRef.current = engine
    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(flashTimerRef.current)
      engine.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handler = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    const update = () => {
      const portrait = window.matchMedia('(orientation: portrait)').matches
      const touch = window.matchMedia('(pointer: coarse)').matches
      setMustRotate(portrait && (touch || window.innerWidth < 900))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  function pulse(kind) {
    setFlash(kind)
    clearTimeout(flashTimerRef.current)
    flashTimerRef.current = setTimeout(() => setFlash(null), 620)
  }

  function choose(i) {
    if (!question || answerState) return
    setPicked(i)
    if (i === question.answer) {
      setAnswerState('ok')
      pulse('ok')
      playCorrect()
      engineRef.current.answerCorrect()
      timerRef.current = setTimeout(() => {
        setQuestion(null)
        setAnswerState(null)
        setPicked(null)
      }, 950)
    } else {
      setAnswerState('bad')
      pulse('bad')
      playWrong()
      engineRef.current.answerWrong()
      timerRef.current = setTimeout(() => {
        if (poolRef.current.length === 0) poolRef.current = buildPool()
        setQuestion(poolRef.current.pop())
        setAnswerState(null)
        setPicked(null)
      }, 1050)
    }
  }

  function toggleSound() {
    setMuted(toggleMuted())
  }

  function startTrip() {
    engineRef.current.start()
    setIntro(false)
  }

  function toggleFullscreen() {
    const el = sceneRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      el.requestFullscreen?.().catch(() => {})
    }
  }

  return (
    <div className="game-scene" ref={sceneRef}>
      <div ref={mountRef} className="game-scene__canvas" />

      {flash && <div className={`game-flash game-flash--${flash}`} aria-hidden="true" />}

      <div className="game-scene__bar">
        <button type="button" className="game-bar-btn" onClick={onBack}>
          🏠 الخروج
        </button>
        <span className="game-bar-chips">
          {STOPS.map((_, i) => (
            <span
              key={i}
              className={
                i < station || won
                  ? 'game-dot game-dot--done'
                  : i === station - 1 && !won
                    ? 'game-dot game-dot--active'
                    : 'game-dot'
              }
            />
          ))}
        </span>
        <span className="game-bar-group">
          <button
            type="button"
            className="game-bar-btn"
            onClick={toggleSound}
            aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className="game-bar-btn"
            onClick={toggleFullscreen}
            aria-label={isFull ? 'إنهاء ملء الشاشة' : 'تكبير ملء الشاشة'}
          >
            {isFull ? '🗗' : '⛶'}
          </button>
        </span>
      </div>

      {intro && !won && (
        <>
          <div className="game-bubble" role="status">
            السلام عليكم، رافقني للذهاب للمسجد..
          </div>
          <button type="button" className="game-start-btn" onClick={startTrip}>
            هيا ننطلق
          </button>
        </>
      )}

      {!question && !won && !intro && (
        <p className="game-hint">
          🚶 يمشي المصلّي على ممشى المشاة نحو المسجد… توقف الأسئلة في {STOPS.length} محطات
        </p>
      )}

      <div
        className="game-screen"
        ref={screenRef}
        style={{ display: question && !won ? 'flex' : 'none' }}
      >
        {question && (
          <>
            <div className="game-screen__head">
              <span className="game-screen__badge">المحطة {station} من {STOPS.length}</span>
              <span className="game-screen__status">
                {answerState === 'ok' ? '✔ صحيح' : answerState === 'bad' ? '✖ خطأ' : 'أجب للإكمال'}
              </span>
            </div>
            <p className="game-screen__q">{question.q}</p>
            <div className="game-screen__opts">
              {question.options.map((opt, i) => {
                let cls = 'game-screen__opt'
                if (answerState && i === question.answer) cls += ' game-screen__opt--correct'
                if (answerState === 'bad' && i === picked) cls += ' game-screen__opt--wrong'
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    disabled={answerState !== null}
                    onClick={() => choose(i)}
                  >
                    <span className="game-screen__mark">{['أ', 'ب', 'ج', 'د'][i]}</span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
            {answerState === 'ok' && (
              <p className="game-screen__fb game-screen__fb--ok">
                رائع! تابع المسير إلى المحطة التالية ⏭
              </p>
            )}
            {answerState === 'bad' && (
              <p className="game-screen__fb game-screen__fb--bad">
                إجابة خاطئة! سيُستبدل السؤال بسؤال آخر 🔄
              </p>
            )}
          </>
        )}
      </div>

      {won && (
        <div className="game-overlay">
          <section className="game-overlay__card panel panel--success score">
            <div className="score__emoji" aria-hidden="true">
              🕌🎉
            </div>
            <h2 className="score__title">وصلت إلى المسجد!</h2>
            <p className="muted">
              أكملت الرحلة وأجبت عن جميع الأسئلة. نلت نجمة الرحلة إلى المسجد ⭐
            </p>
            <div className="screen__footer">
              <button type="button" className="btn btn--ghost" onClick={onRestart}>
                🔄 رحلة جديدة
              </button>
              <button type="button" className="btn btn--primary" onClick={onBack}>
                🏠 الرئيسية
              </button>
            </div>
          </section>
        </div>
      )}

      {mustRotate && (
        <div className="game-rotate" role="alertdialog" aria-live="polite">
          <div className="game-rotate__icon" aria-hidden="true">
            📱
          </div>
          <p className="game-rotate__text">أدر جهازك أفقيًا لتشغيل الرحلة إلى المسجد</p>
        </div>
      )}
    </div>
  )
}

export default function MosqueGameScreen({ setMosqueDone, onNavigate }) {
  const [round, setRound] = useState(1)
  return (
    <div className="screen screen--game">
      <div className="screen__head">
        <h2 className="screen__title">🕌 الرحلة إلى المسجد</h2>
      </div>
      <WalkToMosque
        key={round}
        setMosqueDone={setMosqueDone}
        onBack={() => onNavigate('home')}
        onRestart={() => setRound((r) => r + 1)}
      />
    </div>
  )
}