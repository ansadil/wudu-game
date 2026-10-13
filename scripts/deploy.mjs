import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const REMOTE = 'https://github.com/ansadil/wudu-game.git'
const BRANCH = 'gh-pages'
const SITE_URL = 'https://ansadil.github.io/wudu-game/'

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' })

console.log('▶ Building production bundle...')
run('npm run build', process.cwd())

const dist = join(process.cwd(), 'dist')
if (!existsSync(dist)) {
  console.error('✖ dist/ not found after build.')
  process.exit(1)
}

const staging = mkdtempSync(join(tmpdir(), 'wudu-deploy-'))
console.log('▶ Preparing deploy in', staging)
cpSync(dist, staging, {
  recursive: true,
  filter: (src) => !/[\\/]\.git([\\/]|$)/.test(src),
})
writeFileSync(join(staging, '.nojekyll'), '')

const stamp = new Date().toISOString()
run(`git init -b ${BRANCH}`, staging)
run('git add -A', staging)
run(
  `git -c user.name="deploy" -c user.email="deploy@local" commit -m "Deploy ${stamp}"`,
  staging,
)
run(`git remote add origin ${REMOTE}`, staging)

console.log('▶ Pushing to', BRANCH, '...')
run(`git push -f origin ${BRANCH}`, staging)

rmSync(staging, { recursive: true, force: true })
console.log('✅ Deployed:', SITE_URL)
