import { useCallback, useEffect, useState } from 'react'

const KEY = 'wudu-progress-v1'

const initialProgress = {
  viewedSteps: [],
  lessonRead: false,
  orderBest: 0,
  quizBest: 0,
  tfBest: 0,
  matchBest: 0,
  mosqueDone: false,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialProgress
    return { ...initialProgress, ...JSON.parse(raw) }
  } catch {
    return initialProgress
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      /* ignore storage errors */
    }
  }, [progress])

  const viewStep = useCallback((id) => {
    setProgress((p) =>
      p.viewedSteps.includes(id)
        ? p
        : { ...p, viewedSteps: [...p.viewedSteps, id] },
    )
  }, [])

  const setLessonRead = useCallback(() => {
    setProgress((p) => (p.lessonRead ? p : { ...p, lessonRead: true }))
  }, [])

  const setOrderBest = useCallback((score) => {
    setProgress((p) => ({ ...p, orderBest: Math.max(p.orderBest, score) }))
  }, [])

  const setQuizBest = useCallback((score) => {
    setProgress((p) => ({ ...p, quizBest: Math.max(p.quizBest, score) }))
  }, [])

  const setTfBest = useCallback((score) => {
    setProgress((p) => ({ ...p, tfBest: Math.max(p.tfBest, score) }))
  }, [])

  const setMatchBest = useCallback((score) => {
    setProgress((p) => ({ ...p, matchBest: Math.max(p.matchBest, score) }))
  }, [])

  const setMosqueDone = useCallback(() => {
    setProgress((p) => (p.mosqueDone ? p : { ...p, mosqueDone: true }))
  }, [])

  const reset = useCallback(() => setProgress(initialProgress), [])

  return {
    progress,
    viewStep,
    setLessonRead,
    setOrderBest,
    setQuizBest,
    setTfBest,
    setMatchBest,
    setMosqueDone,
    reset,
  }
}
