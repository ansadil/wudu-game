let ctx = null
let muted = false

try {
  muted = localStorage.getItem('wudu-sound') === 'off'
} catch {
  muted = false
}

function getCtx() {
  if (muted) return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, start = 0, dur = 0.2, type = 'sine', gain = 0.18 }) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export function playCorrect() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) =>
    tone({ freq: f, start: i * 0.09, dur: 0.2, type: 'triangle', gain: 0.16 }),
  )
}

export function playWrong() {
  tone({ freq: 233.08, start: 0, dur: 0.22, type: 'sawtooth', gain: 0.12 })
  tone({ freq: 155.56, start: 0.16, dur: 0.32, type: 'sawtooth', gain: 0.12 })
}

export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
  notes.forEach((f, i) =>
    tone({ freq: f, start: i * 0.13, dur: 0.34, type: 'triangle', gain: 0.16 }),
  )
}

let noiseBuffer = null

function getNoise(c) {
  if (!noiseBuffer) {
    const len = Math.floor(c.sampleRate * 0.15)
    noiseBuffer = c.createBuffer(1, len, c.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

export function playStep(alt = false) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime
  const src = c.createBufferSource()
  src.buffer = getNoise(c)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(alt ? 760 : 980, t0)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(alt ? 0.055 : 0.075, t0 + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)
  src.connect(filter)
  filter.connect(g)
  g.connect(c.destination)
  src.start(t0)
  src.stop(t0 + 0.12)
}

export function isMuted() {
  return muted
}

export function toggleMuted() {
  muted = !muted
  try {
    localStorage.setItem('wudu-sound', muted ? 'off' : 'on')
  } catch {
    /* ignore */
  }
  return muted
}
