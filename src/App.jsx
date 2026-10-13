import { useState } from 'react'
import Header from './components/Header'
import HomeScreen from './screens/HomeScreen'
import LessonScreen from './screens/LessonScreen'
import StepsScreen from './screens/StepsScreen'
import OrderGameScreen from './screens/OrderGameScreen'
import QuizScreen from './screens/QuizScreen'
import BankScreen from './screens/BankScreen'
import MosqueGameScreen from './screens/MosqueGameScreen'
import { useProgress } from './hooks/useProgress'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const {
    progress,
    viewStep,
    setLessonRead,
    setOrderBest,
    setQuizBest,
    setTfBest,
    setMatchBest,
    setMosqueDone,
    reset,
  } = useProgress()

  const stars = [
    progress.lessonRead,
    progress.viewedSteps.length >= 8,
    progress.orderBest >= 6,
    progress.quizBest >= 8,
    progress.tfBest >= 80,
    progress.matchBest >= 80,
    progress.mosqueDone,
  ].filter(Boolean).length

  const screens = {
    home: (
      <HomeScreen
        onNavigate={setScreen}
        stars={stars}
        progress={progress}
        onReset={reset}
      />
    ),
    lesson: (
      <LessonScreen onNavigate={setScreen} markLessonRead={setLessonRead} />
    ),
    steps: (
      <StepsScreen
        viewedSteps={progress.viewedSteps}
        viewStep={viewStep}
        onNavigate={setScreen}
      />
    ),
    order: (
      <OrderGameScreen setOrderBest={setOrderBest} onNavigate={setScreen} />
    ),
    quiz: <QuizScreen setQuizBest={setQuizBest} onNavigate={setScreen} />,
    bank: (
      <BankScreen
        setTfBest={setTfBest}
        setMatchBest={setMatchBest}
        onNavigate={setScreen}
      />
    ),
    mosque: (
      <MosqueGameScreen setMosqueDone={setMosqueDone} onNavigate={setScreen} />
    ),
  }

  return (
    <div className="app">
      <Header screen={screen} onNavigate={setScreen} stars={stars} />
      <main className="main">{screens[screen]}</main>
      <footer className="footer">
        صُنع بحب لطلاب الصف الرابع الابتدائي 💚
      </footer>
    </div>
  )
}
