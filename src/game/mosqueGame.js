import * as THREE from 'three'

export const STOPS = [10, 19, 28, 37, 46, 55, 64]
const MOSQUE_Z = 74
const END_Z = 66
const ROAD_HALF = 3.4
const SPEED = 2.4
const CHEER_DUR = 1.1
const WRONG_DUR = 0.8
const INTRO_FACE = 1.8
const INTRO_TURN = 1.4
const CONFETTI_COLORS = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0xf78c6b]
const BOARD_W = 3.4
const BOARD_H = 2.2
const BOARD_BASE_Y = 0.75
const BOARD_GROW = 1.8

const UP = new THREE.Vector3(0, 1, 0)

function makeMat(color, opts = {}) {
  return new THREE.MeshLambertMaterial({ color, ...opts })
}

function makeSignTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 340
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 512, 340)
  g.addColorStop(0, '#2fb0f0')
  g.addColorStop(1, '#1567b8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 340)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 20
  ctx.strokeRect(20, 20, 472, 300)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 120px Tahoma, Arial, sans-serif'
  ctx.fillText('؟', 256, 130)
  ctx.font = 'bold 62px Tahoma, Arial, sans-serif'
  ctx.fillText('سؤال', 256, 250)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makePaverTexture(len = 64) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#b3a386'
  ctx.fillRect(0, 0, 256, 256)
  const cells = 4
  const s = 256 / cells
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#dcccaa' : '#d3c29e'
      ctx.fillRect(col * s + 3, row * s + 3, s - 6, s - 6)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, Math.max(8, Math.round(len * 0.44)))
  return tex
}

function buildPalm(x, z) {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.26, 4.6, 8),
    makeMat(0x8a5a33),
  )
  trunk.position.y = 2.3
  g.add(trunk)
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2
    const frond = new THREE.Mesh(
      new THREE.ConeGeometry(0.38, 2.0, 6),
      makeMat(0x3f7d3c),
    )
    const to = new THREE.Vector3(Math.cos(a), -0.42, Math.sin(a)).normalize()
    frond.quaternion.setFromUnitVectors(UP, to)
    frond.position.set(Math.cos(a) * 0.55, 4.6, Math.sin(a) * 0.55)
    g.add(frond)
  }
  g.position.set(x, 0, z)
  return g
}

function makeFacadeTexture(base, glass) {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 128, 256)
  const cols = 3
  const rows = 9
  const pad = 12
  const cw = (128 - pad * 2) / cols
  const ch = (256 - pad * 2) / rows
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = Math.random() < 0.3 ? glass : '#3a4a57'
      ctx.fillRect(
        pad + col * cw + cw * 0.16,
        pad + r * ch + ch * 0.14,
        cw * 0.68,
        ch * 0.62,
      )
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function buildBuilding(x, z, w, d, h, tex, tint) {
  const g = new THREE.Group()
  const facade = new THREE.MeshLambertMaterial({ map: tex, color: tint })
  const roofMat = makeMat(0x9aa0a6)
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    [facade, facade, roofMat, roofMat, facade, facade],
  )
  box.position.y = h / 2
  g.add(box)
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.16, 0.3, d + 0.16),
    roofMat,
  )
  parapet.position.y = h + 0.15
  g.add(parapet)
  if (Math.random() < 0.5) {
    const unit = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.42, 0.55, d * 0.42),
      makeMat(0xb7bcc2),
    )
    unit.position.set(w * 0.12, h + 0.62, -d * 0.12)
    g.add(unit)
  }
  g.position.set(x, 0, z)
  return g
}

function buildArchPanel(width, rectH, mat) {
  const g = new THREE.Group()
  const rect = new THREE.Mesh(new THREE.PlaneGeometry(width, rectH), mat)
  rect.position.y = rectH / 2
  g.add(rect)
  const arch = new THREE.Mesh(
    new THREE.CircleGeometry(width / 2, 24, 0, Math.PI),
    mat,
  )
  arch.position.y = rectH
  g.add(arch)
  return g
}

function buildMosque() {
  const g = new THREE.Group()
  const white = makeMat(0xf7f4e9)
  const gold = makeMat(0xd9a441, { side: THREE.DoubleSide })
  const green = makeMat(0x20734b)
  const glass = makeMat(0x8fd0ea, { side: THREE.DoubleSide })
  const doorMat = makeMat(0x12402f, { side: THREE.DoubleSide })

  const NEAR = -3.3
  const HALL_HALF_W = 4.5
  const FLOOR_Y = 0.7

  const plaza = new THREE.Mesh(new THREE.CircleGeometry(10, 40), makeMat(0xd0a86b))
  plaza.rotation.x = -Math.PI / 2
  plaza.position.set(0, 0.01, -1.5)
  g.add(plaza)

  const base = new THREE.Mesh(new THREE.BoxGeometry(13, 0.7, 9), makeMat(0xc9a76c))
  base.position.y = 0.35
  g.add(base)

  const steps = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 1.2), makeMat(0xc9a76c))
  steps.position.set(0, 0.1, NEAR - 0.95)
  g.add(steps)

  const hall = new THREE.Mesh(new THREE.BoxGeometry(9, 5.4, 6.6), white)
  hall.position.set(0, FLOOR_Y + 2.7, 0)
  g.add(hall)

  // ---- facade (الواجهة) ----
  const facade = new THREE.Mesh(new THREE.BoxGeometry(9.6, 5.8, 0.4), white)
  facade.position.set(0, FLOOR_Y + 2.9, NEAR - 0.2)
  g.add(facade)

  const cornice = new THREE.Mesh(new THREE.BoxGeometry(9.9, 0.4, 0.72), gold)
  cornice.position.set(0, FLOOR_Y + 5.75, NEAR - 0.2)
  g.add(cornice)

  for (const px of [-4.55, 4.55]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.55, 5.7, 0.5), white)
    pil.position.set(px, FLOOR_Y + 2.85, NEAR - 0.2)
    g.add(pil)
  }

  // ---- door (الباب) ----
  const doorFrame = buildArchPanel(2.7, 3.0, gold)
  doorFrame.position.set(0, FLOOR_Y, NEAR - 0.42)
  doorFrame.rotation.y = Math.PI
  g.add(doorFrame)

  const doorPanel = buildArchPanel(2.2, 2.9, doorMat)
  doorPanel.position.set(0, FLOOR_Y, NEAR - 0.5)
  doorPanel.rotation.y = Math.PI
  g.add(doorPanel)

  const doorSplit = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.8, 0.04), gold)
  doorSplit.position.set(0, FLOOR_Y + 1.45, NEAR - 0.53)
  g.add(doorSplit)

  // ---- windows (النوافذ) ----
  const frontWindows = [
    { x: -3.05, y: FLOOR_Y + 0.95, w: 1.15, h: 1.75 },
    { x: 3.05, y: FLOOR_Y + 0.95, w: 1.15, h: 1.75 },
    { x: -3.05, y: FLOOR_Y + 3.7, w: 1.0, h: 1.15 },
    { x: 3.05, y: FLOOR_Y + 3.7, w: 1.0, h: 1.15 },
  ]
  for (const wp of frontWindows) {
    const frame = buildArchPanel(wp.w + 0.28, wp.h + 0.12, gold)
    frame.position.set(wp.x, wp.y, NEAR - 0.42)
    frame.rotation.y = Math.PI
    g.add(frame)
    const pane = buildArchPanel(wp.w, wp.h, glass)
    pane.position.set(wp.x, wp.y, NEAR - 0.48)
    pane.rotation.y = Math.PI
    g.add(pane)
  }

  for (const sx of [-HALL_HALF_W, HALL_HALF_W]) {
    const sign = Math.sign(sx)
    for (const sz of [-1.6, 0.6]) {
      const frame = buildArchPanel(1.1, 1.6, gold)
      frame.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2
      frame.position.set(sx + sign * 0.42, FLOOR_Y + 1.2, sz)
      g.add(frame)
      const pane = buildArchPanel(0.85, 1.5, glass)
      pane.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2
      pane.position.set(sx + sign * 0.48, FLOOR_Y + 1.2, sz)
      g.add(pane)
    }
  }

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    green,
  )
  dome.scale.set(1, 1.12, 1)
  dome.position.set(0, 6.08, 0)
  g.add(dome)

  const finialStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.8, 8), gold)
  finialStem.position.y = 8.85
  g.add(finialStem)
  const finialBall = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), gold)
  finialBall.position.y = 9.35
  g.add(finialBall)

  const minaretPos = [
    [-5.9, -2.6],
    [5.9, -2.6],
  ]
  for (const [mx, mz] of minaretPos) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 7.4, 12), white)
    shaft.position.set(mx, 0.7 + 3.7, mz)
    g.add(shaft)
    const balcony = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.09, 8, 20), gold)
    balcony.rotation.x = Math.PI / 2
    balcony.position.set(mx, 6.9, mz)
    g.add(balcony)
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.44, 1.0, 12), green)
    cap.position.set(mx, 7.9, mz)
    g.add(cap)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), gold)
    tip.position.set(mx, 8.55, mz)
    g.add(tip)
  }

  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8), gold)
  flagPole.position.set(-7.0, 1.7, -3.2)
  g.add(flagPole)
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.03), makeMat(0x006c35))
  flag.position.set(-6.75, 3.05, -3.2)
  g.add(flag)

  g.position.set(0, 0, MOSQUE_Z)
  return g
}

function buildBoard(x, z) {
  const g = new THREE.Group()
  const tex = makeSignTexture()
  const texMat = new THREE.MeshLambertMaterial({ map: tex })
  const sideMat = makeMat(0x1c8ef0)
  const frameMat = makeMat(0xb8b09b)
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(BOARD_W, BOARD_H, 0.16),
    [sideMat, sideMat, frameMat, frameMat, texMat, texMat],
  )
  board.position.y = BOARD_H / 2 + BOARD_BASE_Y
  g.add(board)

  const legH = BOARD_BASE_Y + 0.25
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.11, legH, 0.11), frameMat)
  legL.position.set(-BOARD_W / 2 + 0.35, legH / 2, 0)
  g.add(legL)
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.11, legH, 0.11), frameMat)
  legR.position.set(BOARD_W / 2 - 0.35, legH / 2, 0)
  g.add(legR)
  const foot = new THREE.Mesh(new THREE.BoxGeometry(BOARD_W * 0.7, 0.14, 1.1), frameMat)
  foot.position.y = 0.07
  g.add(foot)

  g.position.set(x, 0, z)
  return { g, board, material: texMat }
}

function makeShmaghTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  const n = 8
  const s = 256 / n
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      ctx.fillStyle = (r + col) % 2 === 0 ? '#c0392b' : '#f6f3ec'
      ctx.fillRect(col * s, r * s, s, s)
    }
  }
  ctx.strokeStyle = 'rgba(120, 20, 15, 0.35)'
  ctx.lineWidth = 1
  for (let i = 0; i <= n; i++) {
    ctx.beginPath()
    ctx.moveTo(i * s, 0)
    ctx.lineTo(i * s, 256)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * s)
    ctx.lineTo(256, i * s)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

function buildCharacter() {
  const g = new THREE.Group()
  const std = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0, ...opts })
  const skin = std(0xd8a878, { roughness: 0.72 })
  const skinDark = std(0xc18f60, { roughness: 0.78 })
  const thobe = std(0xfbfaf6, { roughness: 0.92 })
  const thobeShade = std(0xe6e2d6, { roughness: 0.92 })
  const hair = std(0x33251a, { roughness: 0.95 })
  const eyeMat = std(0x241d17, { roughness: 0.35 })
  const shmaghMat = new THREE.MeshStandardMaterial({
    map: makeShmaghTexture(),
    roughness: 0.94,
    side: THREE.DoubleSide,
  })

  // ---------- thobe (smooth robe) ----------
  const profile = [
    [0.255, 0.2],
    [0.285, 0.36],
    [0.29, 0.6],
    [0.278, 0.84],
    [0.248, 1.02],
    [0.212, 1.13],
    [0.178, 1.18],
    [0.138, 1.22],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const robe = new THREE.Mesh(new THREE.LatheGeometry(profile, 40), thobe)
  g.add(robe)

  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 16), thobe)
  shoulders.scale.set(1.28, 0.62, 1.04)
  shoulders.position.y = 1.13
  g.add(shoulders)

  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.6, 0.015), thobeShade)
  placket.position.set(0, 0.82, 0.238)
  g.add(placket)
  const btnMat = std(0xc9c3b4, { roughness: 0.5, metalness: 0.3 })
  for (const y of [0.62, 0.82, 1.02]) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), btnMat)
    btn.position.set(0, y, 0.252)
    g.add(btn)
  }

  // ---------- arms with elbows, hands, fingers ----------
  function makeArm(side) {
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.25, 1.12, 0)
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.13, 8, 16), thobe)
    upper.position.y = -0.105
    pivot.add(upper)

    const fore = new THREE.Group()
    fore.position.y = -0.21
    fore.rotation.x = 0.14
    const foreMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.1, 8, 16), thobe)
    foreMesh.position.y = -0.085
    fore.add(foreMesh)
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.058, 0.055, 14), thobeShade)
    cuff.position.y = -0.14
    fore.add(cuff)
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.095, 0.045), skin)
    hand.position.y = -0.195
    fore.add(hand)
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.035, 4, 8), skin)
      f.position.set(-0.026 + i * 0.017, -0.245, 0.004)
      fore.add(f)
    }
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.03, 4, 8), skin)
    thumb.position.set(side * 0.034, -0.21, 0.018)
    thumb.rotation.z = side * 0.8
    fore.add(thumb)
    pivot.add(fore)
    return pivot
  }
  const armPivotL = makeArm(-1)
  const armPivotR = makeArm(1)
  g.add(armPivotL)
  g.add(armPivotR)

  // ---------- legs + sandals ----------
  function makeLeg(side) {
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.1, 0.62, 0)
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.078, 0.34, 8, 14), skinDark)
    leg.position.y = -0.27
    pivot.add(leg)
    const leather = std(0x6d4a30, { roughness: 0.7 })
    const sandal = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.27), leather)
    sandal.position.set(0, -0.55, 0.06)
    pivot.add(sandal)
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.025, 0.06), std(0x5a3c26, { roughness: 0.7 }))
    strap.position.set(0, -0.52, 0.08)
    pivot.add(strap)
    return pivot
  }
  const legPivotL = makeLeg(-1)
  const legPivotR = makeLeg(1)
  g.add(legPivotL)
  g.add(legPivotR)

  // ---------- neck + head ----------
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.07, 0.12, 14), skin)
  neck.position.y = 1.24
  g.add(neck)

  const head = new THREE.Group()
  head.position.y = 1.37
  g.add(head)

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 24), skin)
  skull.scale.set(0.92, 1.04, 0.96)
  head.add(skull)

  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 18), skin)
  jaw.scale.set(0.86, 0.72, 0.92)
  jaw.position.set(0, -0.09, 0.02)
  head.add(jaw)

  const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.04), skin)
  noseBridge.position.set(0, 0.012, 0.128)
  head.add(noseBridge)
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), skin)
  noseTip.scale.set(1, 0.85, 1)
  noseTip.position.set(0, -0.02, 0.15)
  head.add(noseTip)

  const eyeWhiteMat = std(0xf6f2ea, { roughness: 0.4 })
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.033, 14, 12), skin)
    ear.scale.set(0.5, 1, 0.85)
    ear.position.set(sx * 0.132, -0.005, 0)
    head.add(ear)

    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), eyeWhiteMat)
    eyeWhite.scale.set(1, 0.82, 0.55)
    eyeWhite.position.set(sx * 0.055, 0.018, 0.128)
    head.add(eyeWhite)

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.014, 14, 12), eyeMat)
    pupil.scale.set(1, 1, 0.7)
    pupil.position.set(sx * 0.057, 0.018, 0.144)
    head.add(pupil)

    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.014, 0.014), hair)
    brow.position.set(sx * 0.055, 0.058, 0.138)
    brow.rotation.z = -sx * 0.1
    head.add(brow)
  }

  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.014, 0.014),
    std(0x8a4a3c, { roughness: 0.6 }),
  )
  mouth.position.set(0, -0.052, 0.134)
  head.add(mouth)

  const beard = new THREE.Mesh(new THREE.SphereGeometry(0.108, 22, 18), hair)
  beard.scale.set(0.8, 0.62, 0.74)
  beard.position.set(0, -0.135, 0.03)
  head.add(beard)

  const mustache = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.018, 0.02), hair)
  mustache.position.set(0, -0.03, 0.14)
  head.add(mustache)

  // ---------- shmagh: smooth hood + side/back drape + agal ----------
  const shmaghTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.178, 30, 22, 0, Math.PI * 2, 0, Math.PI * 0.37),
    shmaghMat,
  )
  shmaghTop.scale.set(1.02, 0.98, 1.02)
  head.add(shmaghTop)

  const gap = 0.68
  const shmaghDrape = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.184,
      44,
      14,
      Math.PI / 2 + gap,
      Math.PI * 2 - gap * 2,
      Math.PI * 0.37,
      Math.PI * 0.33,
    ),
    shmaghMat,
  )
  shmaghDrape.scale.set(1.03, 1.06, 1.03)
  head.add(shmaghDrape)

  const agal = new THREE.Mesh(
    new THREE.TorusGeometry(0.158, 0.022, 10, 32),
    std(0x15151a, { roughness: 0.45, metalness: 0.1 }),
  )
  agal.rotation.x = Math.PI / 2
  agal.position.y = 0.1
  head.add(agal)

  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })

  return { group: g, armPivotL, armPivotR, legPivotL, legPivotR }
}

export function createMosqueGame(container, { onStation, onFinish, onStep, onBoardRect }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#9ed0f2')
  scene.fog = new THREE.Fog('#cfe6f2', 40, 100)

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth || 800, container.clientHeight || 480)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  container.appendChild(renderer.domElement)

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd2b48c, 0.85))
  const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.35)
  sunLight.position.set(14, 24, 10)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(1024, 1024)
  const sc = sunLight.shadow.camera
  sc.left = -22
  sc.right = 22
  sc.top = 22
  sc.bottom = -22
  sc.near = 1
  sc.far = 90
  sunLight.shadow.bias = -0.0005
  scene.add(sunLight)
  scene.add(sunLight.target)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    makeMat(0xc2bbae),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.set(0, -0.02, 34)
  ground.receiveShadow = true
  scene.add(ground)

  const WALK_BACK = -46
  const WALK_FRONT = 66
  const WALK_LEN = WALK_FRONT - WALK_BACK
  const WALK_CENTER = (WALK_FRONT + WALK_BACK) / 2

  const walkway = new THREE.Mesh(
    new THREE.BoxGeometry(ROAD_HALF * 2, 0.2, WALK_LEN),
    new THREE.MeshLambertMaterial({ map: makePaverTexture(WALK_LEN) }),
  )
  walkway.position.set(0, 0.02, WALK_CENTER)
  walkway.receiveShadow = true
  scene.add(walkway)

  const curbMat = makeMat(0xa5956f)
  for (const side of [-1, 1]) {
    const curb = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.22, WALK_LEN),
      curbMat,
    )
    curb.position.set(side * (ROAD_HALF + 0.15), 0.11, WALK_CENTER)
    scene.add(curb)
  }

  const facadeTexs = [
    makeFacadeTexture('#e7e0d4', '#ffd98a'),
    makeFacadeTexture('#d9cdb8', '#ffe0a0'),
    makeFacadeTexture('#ccd6de', '#cfe8ff'),
    makeFacadeTexture('#e3d3bc', '#ffd98a'),
    makeFacadeTexture('#d6d9d0', '#d8f0ff'),
  ]
  const buildTints = [0xffffff, 0xf1e9dc, 0xe8eff4, 0xefe3cf, 0xf6f1e8]
  for (const side of [-1, 1]) {
    for (const rowX of [10.5, 17.5]) {
      let z = -22
      let k = 0
      while (z < 74) {
        const w = 3.2 + Math.random() * 3.2
        const d = 3 + Math.random() * 3.6
        const h = 6 + Math.random() * (rowX > 14 ? 15 : 11)
        const x = side * (rowX + (Math.random() - 0.5) * 2)
        const tex = facadeTexs[(k + (side > 0 ? 1 : 0) + Math.floor(rowX)) % facadeTexs.length]
        const tint = buildTints[k % buildTints.length]
        const b = buildBuilding(x, z + d / 2, w, d, h, tex, tint)
        b.traverse((o) => {
          if (o.isMesh) o.castShadow = true
        })
        scene.add(b)
        z += d + 0.7
        k++
      }
    }
  }

  const palmPos = [
    [-6.2, -8], [6.5, -4], [-6.2, 8], [6.5, 12], [-6.5, 26], [6.5, 32],
    [-6.2, 44], [6.2, 50], [-6.5, 60], [6.2, 66],
  ]
  palmPos.forEach(([x, z]) => scene.add(buildPalm(x, z)))

  const bushMat = makeMat(0x4c8a44)
  for (let i = 0; i < 8; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const z = 6 + i * 6.5
    const bush = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 10, 8),
      bushMat,
    )
    bush.position.set(side * (ROAD_HALF + 1.9), 0.45, z)
    bush.scale.y = 0.85
    scene.add(bush)
  }

  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(6, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff3c4 }),
  )
  sunGlow.position.set(20, 30, -25)
  scene.add(sunGlow)

  const mosque = buildMosque()
  mosque.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })
  scene.add(mosque)

  const boards = STOPS.map((z, i) => {
    const side = i % 2 === 0 ? 1 : -1
    const bx = side * (ROAD_HALF + 0.7)
    const b = buildBoard(bx, z)
    b.g.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
    b.x = bx
    b.fx = null
    b.fxT = 0
    b.boardScale = 1
    b.material = b.material.clone()
    b.g.traverse((o) => {
      if (o.isMesh) o.castShadow = true
    })
    scene.add(b.g)
    return b
  })

  const character = buildCharacter()
  character.group.position.set(0, 0, 0)
  scene.add(character.group)

  let mode = 'intro'
  let camMode = 'follow'
  let nextStop = 0
  let charZ = 3
  let charYaw = Math.PI
  let introT = 0
  let walkT = 0
  let stepPhase = 0
  let cheerT = 0
  let wrongT = 0
  let holdT = 0
  let signalled = false

  const confetti = []

  const projV = new THREE.Vector3()
  let rectOn = false

  function projectBoard(b) {
    const s = b.boardScale * b.g.scale.x
    const halfW = (BOARD_W * s) / 2
    const halfH = (BOARD_H * s) / 2
    const cy = BOARD_BASE_Y + (BOARD_H / 2) * s
    const cz = b.g.position.z
    const W = container.clientWidth || 800
    const H = container.clientHeight || 480
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    const ys = [cy - halfH, cy + halfH]
    const zs = [cz - halfW, cz + halfW]
    for (let yi = 0; yi < 2; yi++) {
      for (let zi = 0; zi < 2; zi++) {
        projV.set(b.x, ys[yi], zs[zi])
        projV.project(camera)
        if (projV.z > 1) return null
        const px = (projV.x * 0.5 + 0.5) * W
        const py = (-projV.y * 0.5 + 0.5) * H
        if (px < minX) minX = px
        if (px > maxX) maxX = px
        if (py < minY) minY = py
        if (py > maxY) maxY = py
      }
    }
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  }

  function spawnConfetti(x, y, z) {
    for (let i = 0; i < 26; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.02), mat)
      m.position.set(x, y, z)
      scene.add(m)
      confetti.push({
        m,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        vz: (Math.random() - 0.5) * 4,
        life: 1.2,
        maxLife: 1.2,
      })
    }
  }

  function start() {
    if (mode === 'intro') {
      mode = 'starting'
      introT = 0
    }
  }

  function answerCorrect() {
    if (mode !== 'stopped') return
    const b = boards[nextStop]
    b.fx = 'ok'
    b.fxT = 0.9
    cheerT = CHEER_DUR
    holdT = 0.95
    spawnConfetti(b.x, 2.4, b.g.position.z)
    mode = 'holding'
  }

  function answerWrong() {
    if (mode !== 'stopped') return
    const b = boards[nextStop]
    b.fx = 'bad'
    b.fxT = 0.8
    wrongT = WRONG_DUR
  }

  function dispose() {
    renderer.setAnimationLoop(null)
    window.removeEventListener('resize', onResize)
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose()
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          m.map?.dispose()
          m.dispose()
        })
      }
    })
    renderer.dispose()
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }

  function onResize() {
    const w = container.clientWidth || 800
    const h = container.clientHeight || 480
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)
  camera.aspect = (container.clientWidth || 800) / (container.clientHeight || 480)
  camera.updateProjectionMatrix()

  const desiredPos = new THREE.Vector3()
  const desiredLook = new THREE.Vector3()
  const camLook = new THREE.Vector3(0, 1.35, charZ + 0.2)
  camera.position.set(0, 1.95, charZ - 4.8)
  camera.lookAt(camLook)

  const clock = new THREE.Clock()
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime || 0

    if (mode === 'walking') {
      charZ += SPEED * dt
      if (charZ >= END_Z) {
        charZ = END_Z
        mode = 'won'
        onFinish()
      } else if (nextStop < STOPS.length && charZ >= STOPS[nextStop]) {
        mode = 'stopped'
        camMode = 'focus'
        signalled = false
        boards[nextStop].material.emissive.set(0x000000)
        boards[nextStop].g.position.x = boards[nextStop].x
      }
    }

    for (const b of boards) {
      if (b.fxT > 0) {
        b.fxT -= dt
        if (b.fx === 'bad') {
          b.material.emissive.setHex(0x8a3322)
          b.g.position.x = b.x + Math.sin(Math.max(0, b.fxT) * 42) * 0.2
        } else {
          b.material.emissive.setHex(0x1f7a3f)
          const s = 1 + Math.max(0, Math.sin((0.9 - b.fxT) * Math.PI)) * 0.14
          b.g.scale.set(s, s, s)
        }
        if (b.fxT <= 0) {
          b.fx = null
          b.g.position.x = b.x
          b.g.scale.set(1, 1, 1)
          b.material.emissive.setHex(0x000000)
        }
      }
    }

    for (const b of boards) {
      const active =
        (mode === 'stopped' || mode === 'holding') && b === boards[nextStop]
      const target = active ? BOARD_GROW : 1
      b.boardScale += (target - b.boardScale) * Math.min(1, dt * 4)
      b.board.scale.set(b.boardScale, b.boardScale, 1)
      b.board.position.y = BOARD_BASE_Y + (BOARD_H / 2) * b.boardScale
    }

    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i]
      c.life -= dt
      c.vy -= 7 * dt
      c.m.position.x += c.vx * dt
      c.m.position.y += c.vy * dt
      c.m.position.z += c.vz * dt
      c.m.rotation.x += dt * 7
      c.m.rotation.y += dt * 5
      c.m.scale.setScalar(Math.max(0, c.life / c.maxLife))
      if (c.life <= 0) {
        scene.remove(c.m)
        c.m.geometry.dispose()
        c.m.material.dispose()
        confetti.splice(i, 1)
      }
    }

    let targetYaw = 0
    if (mode === 'intro') {
      introT += dt
      targetYaw = Math.PI
      const p = Math.min(1, introT / INTRO_FACE)
      const ease = 1 - (1 - p) * (1 - p)
      desiredPos.set(0, 1.95, charZ - (4.8 - 1.6 * ease))
      desiredLook.set(0, 1.35, charZ + 0.2)
    } else if (mode === 'starting') {
      introT += dt
      targetYaw = 0
      desiredPos.set(0, 3.6, charZ - 6.5)
      desiredLook.set(0, 1.4, charZ + 3)
      if (introT >= INTRO_TURN) {
        mode = 'walking'
        camMode = 'follow'
      }
    } else if (
      (mode === 'stopped' || mode === 'holding') &&
      camMode === 'focus' &&
      nextStop < boards.length
    ) {
      const b = boards[nextStop]
      const sign = Math.sign(b.x) || 1
      targetYaw = sign * 1.4
      desiredPos.set(-sign * 3.8, 3.5, b.g.position.z - 3.8)
      desiredLook.set(sign * 1.9, 2.3, b.g.position.z - 0.1)
    } else {
      desiredPos.set(0, 3.6, charZ - 6.5)
      desiredLook.set(0, 1.4, charZ + 3)
    }

    const camSpeed = camMode === 'follow' ? 4 : 2.4
    const k = Math.min(1, dt * camSpeed)
    camera.position.lerp(desiredPos, k)
    camLook.lerp(desiredLook, k)
    camera.lookAt(camLook)

    if (
      mode === 'stopped' &&
      camMode === 'focus' &&
      !signalled &&
      camera.position.distanceTo(desiredPos) < 0.9
    ) {
      signalled = true
      onStation(nextStop)
    }

    if (camMode === 'return' && camera.position.distanceTo(desiredPos) < 0.9) {
      camMode = 'follow'
      mode = 'walking'
    }

    if (mode === 'holding') {
      holdT -= dt
      if (holdT <= 0) {
        boards[nextStop].fx = null
        nextStop += 1
        camMode = 'return'
        mode = 'leaving'
      }
    }

    if (onBoardRect) {
      if ((mode === 'stopped' || mode === 'holding') && nextStop < boards.length) {
        onBoardRect(projectBoard(boards[nextStop]))
        rectOn = true
      } else if (rectOn) {
        onBoardRect(null)
        rectOn = false
      }
    }

    charYaw += (targetYaw - charYaw) * Math.min(1, dt * 5)
    character.group.rotation.y = charYaw

    if (cheerT > 0) {
      cheerT -= dt
      const p = 1 - Math.max(0, cheerT) / CHEER_DUR
      character.armPivotL.rotation.x = -2.6
      character.armPivotR.rotation.x = -2.6
      character.legPivotL.rotation.x = 0
      character.legPivotR.rotation.x = 0
      character.group.position.set(0, Math.abs(Math.sin(p * Math.PI * 4)) * 0.26, charZ)
      character.group.rotation.z = Math.sin(p * Math.PI * 6) * 0.05
    } else if (wrongT > 0) {
      wrongT -= dt
      const p = 1 - Math.max(0, wrongT) / WRONG_DUR
      const sway = Math.sin(p * Math.PI * 8) * (1 - p) * 0.4
      character.armPivotL.rotation.x = sway
      character.armPivotR.rotation.x = -sway
      character.legPivotL.rotation.x = 0
      character.legPivotR.rotation.x = 0
      character.group.position.set(0, Math.sin(t * 2) * 0.015, charZ)
      character.group.rotation.z = -sway * 0.3
    } else {
      const walking = mode === 'walking'
      if (walking) {
        walkT += dt * 10
        const phase = Math.floor(walkT / Math.PI)
        if (phase !== stepPhase) {
          stepPhase = phase
          if (onStep) onStep(phase % 2 === 0)
        }
      }
      const bob = walking ? Math.abs(Math.sin(walkT)) * 0.08 : Math.sin(t * 2) * 0.015
      character.group.position.set(0, bob, charZ)
      const swing = walking ? Math.sin(walkT) * 0.55 : 0
      character.armPivotL.rotation.x = swing
      character.armPivotR.rotation.x = -swing
      character.legPivotL.rotation.x = -swing * 0.9
      character.legPivotR.rotation.x = swing * 0.9
      character.group.rotation.z = walking ? Math.sin(walkT) * 0.03 : 0
    }

    sunLight.position.set(14, 24, charZ + 10)
    sunLight.target.position.set(0, 0, charZ)
    sunLight.target.updateMatrixWorld()

    renderer.render(scene, camera)
  })

  return { answerCorrect, answerWrong, start, dispose }
}