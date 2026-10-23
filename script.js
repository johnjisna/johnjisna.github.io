const result = document.getElementById('terminalResult');
const input = document.getElementById('terminalInput');
const form = document.getElementById('terminalForm');
const commands = {
  help: 'Available commands: about, skills, projects, impact, experience, contact, clear',
  about: 'Jisna C John — DevOps Engineer focused on cloud infrastructure, Kubernetes, GitOps, observability, and reliable production systems.',
  skills: 'Cloud: AWS, Azure, GCP, DigitalOcean\\nContainers: Kubernetes, Docker, Helm\\nIaC & delivery: Terraform, Ansible, GitHub Actions, Azure DevOps, Argo CD\\nObservability & security: Prometheus, Grafana, Loki, Tempo, Vault, External Secrets Operator',
  projects: 'Lucius AI — browser automation SaaS infrastructure\\nPerfAgents — Kubernetes performance-testing platform\\nVexabot AI — AI chatbot deployment\\nPlatformPilot — Go + Kubernetes personal lab',
  impact: '+40% concurrent test capacity\\n−25% environment cost\\n−40% mean time to detect\\n−80% manually managed secrets\\nThese are reported project outcomes, not live metrics.',
  experience: 'Testing Mavens (Oct 2025–present)\\nSayone Technologies (May 2024–Sep 2025)\\nInnovature Labs (Apr 2022–Mar 2024)',
  contact: 'Email: johnjisna66@gmail.com\\nLinkedIn: linkedin.com/in/johnjisna\\nGitHub: github.com/johnjisna',
  clear: ''
};
function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  if (command === 'clear') { result.textContent = 'Terminal cleared. Try: help, skills, projects, impact, contact'; return; }
  result.textContent = commands[command] || `Command not found: ${command}\\nType "help" to see available commands.`;
}
form.addEventListener('submit', e => { e.preventDefault(); runCommand(input.value); input.value = ''; });
document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => runCommand(button.dataset.command)));
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Pod Rescue: a small, self-contained browser mini-game. No network or backend required.
(() => {
  const board = document.getElementById('gameBoard');
  const start = document.getElementById('gameStart');
  if (!board || !start) return;
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const bestEl = document.getElementById('gameBest');
  const statusEl = document.getElementById('gameStatus');
  const hintEl = document.getElementById('gameHint');
  let score = 0, time = 20, active = false, tick = null, spawn = null, best = 0;
  try { best = Number(localStorage.getItem('podRescueBest') || 0); } catch (_) {}
  bestEl.textContent = String(best).padStart(2, '0');
  const clearTimers = () => { if (tick) clearInterval(tick); if (spawn) clearInterval(spawn); tick = spawn = null; };
  const finish = () => {
    active = false; clearTimers(); start.innerHTML = 'Play again <span>↻</span>';
    statusEl.textContent = 'RESCUE COMPLETE';
    hintEl.textContent = `Run complete — you rescued ${score} healthy pod${score === 1 ? '' : 's'}. Try to beat your best.`;
    board.querySelectorAll('button').forEach(b => { b.disabled = true; });
  };
  const spawnPod = () => {
    if (!active) return;
    const existing = [...board.querySelectorAll('.pod-target')];
    if (existing.length >= 8) return;
    const healthy = Math.random() > 0.28;
    const pod = document.createElement('button');
    pod.type = 'button'; pod.className = `pod-target ${healthy ? 'healthy' : 'failed'}`;
    pod.setAttribute('aria-label', healthy ? 'Healthy pod: rescue for points' : 'Failed pod: avoid');
    pod.innerHTML = `<span class="pod-glyph">${healthy ? '⬡' : '×'}</span><span>${healthy ? 'READY' : 'FAILED'}</span>`;
    pod.addEventListener('click', () => {
      if (!active || pod.disabled) return;
      pod.disabled = true;
      if (healthy) { score += 1; pod.classList.add('caught'); pod.querySelector('span:last-child').textContent = '+1 RESCUED'; hintEl.textContent = 'Healthy pod rescued. Keep going!'; }
      else { score = Math.max(0, score - 2); pod.classList.add('missed'); pod.querySelector('span:last-child').textContent = '−2 PENALTY'; hintEl.textContent = 'That pod had failed. Watch the status label!'; }
      scoreEl.textContent = String(score).padStart(2, '0');
      if (score > best) { best = score; bestEl.textContent = String(best).padStart(2, '0'); try { localStorage.setItem('podRescueBest', String(best)); } catch (_) {} }
      setTimeout(() => pod.remove(), 350);
    });
    const slots = [...Array(12).keys()].sort(() => Math.random() - .5);
    const used = new Set(existing.map(b => b.dataset.slot));
    const slot = slots.find(n => !used.has(String(n)));
    if (slot === undefined) return;
    pod.dataset.slot = String(slot); pod.style.gridColumn = String(slot % 4 + 1); pod.style.gridRow = String(Math.floor(slot / 4) + 1);
    board.querySelector('.game-empty')?.remove(); board.appendChild(pod);
    setTimeout(() => { if (pod.isConnected && !pod.disabled) { pod.classList.add('missed'); setTimeout(() => pod.remove(), 220); } }, 1800);
  };
  start.addEventListener('click', () => {
    clearTimers(); score = 0; time = 20; active = true;
    scoreEl.textContent = '00'; timeEl.textContent = '20s'; statusEl.textContent = 'CLUSTER ACTIVE';
    hintEl.textContent = 'Rescue healthy pods before they disappear.';
    board.innerHTML = '<div class="game-grid-glow"></div>';
    start.innerHTML = 'Rescue in progress…'; start.disabled = true;
    for (let i = 0; i < 5; i++) spawnPod();
    spawn = setInterval(spawnPod, 650);
    tick = setInterval(() => { time -= 1; timeEl.textContent = `${time}s`; if (time <= 0) { finish(); start.disabled = false; } }, 1000);
  });
})();
