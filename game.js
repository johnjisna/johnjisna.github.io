(() => {
  const range = document.getElementById('shootingRange');
  const start = document.getElementById('arcadeStart');
  const again = document.getElementById('arcadeAgain');
  const scoreEl = document.getElementById('arcadeScore');
  const timeEl = document.getElementById('arcadeTime');
  const bestEl = document.getElementById('arcadeBest');
  const missesEl = document.getElementById('arcadeMisses');
  const statusEl = document.getElementById('arcadeStatus');
  const hintEl = document.getElementById('arcadeHint');
  const hud = document.getElementById('rangeHud');
  const endPanel = document.getElementById('arcadeEnd');
  const endTitle = document.getElementById('arcadeEndTitle');
  const endText = document.getElementById('arcadeEndText');
  let score = 0, time = 30, misses = 0, active = false, tick = null, spawn = null, best = 0;
  try { best = Number(localStorage.getItem('podRescueShooterBest') || 0); } catch (_) {}
  bestEl.textContent = String(best).padStart(2, '0');
  const update = () => { scoreEl.textContent = String(score).padStart(2, '0'); timeEl.textContent = `${time}s`; missesEl.textContent = String(misses).padStart(2, '0'); bestEl.textContent = String(best).padStart(2, '0'); };
  const stopTimers = () => { clearInterval(tick); clearInterval(spawn); tick = spawn = null; };
  function endGame() {
    active = false; stopTimers(); range.querySelectorAll('.failed-target').forEach(el => el.remove());
    statusEl.textContent = 'SIMULATION COMPLETE'; hud.textContent = 'SESSION ENDED';
    endTitle.textContent = score >= 15 ? 'Cluster secured!' : 'Session complete';
    endText.textContent = `You shot ${score} failed pods. ${misses} escaped. ${score > best ? 'New high score!' : 'Try another run to beat your best.'}`;
    endPanel.hidden = false; start.disabled = false; start.innerHTML = 'Play again <span>↻</span>';
    hintEl.textContent = 'Simulation ended. Ready for another round?';
  }
  function shootAt(x, y) {
    const flash = document.createElement('span'); flash.className = 'shot-flash'; flash.style.left = `${x}px`; flash.style.top = `${y}px`; range.appendChild(flash); setTimeout(() => flash.remove(), 400);
  }
  function spawnTarget() {
    if (!active) return;
    const existing = range.querySelectorAll('.failed-target');
    if (existing.length >= 6) return;
    const target = document.createElement('button'); target.type = 'button'; target.className = 'failed-target'; target.setAttribute('aria-label', 'Shoot failed pod');
    target.innerHTML = '<span>×</span><small>FAILED</small>';
    const rect = range.getBoundingClientRect(); const pad = 16; const size = 60;
    const x = pad + Math.random() * Math.max(1, rect.width - size - pad * 2); const y = 54 + Math.random() * Math.max(1, rect.height - size - 74);
    target.style.left = `${x}px`; target.style.top = `${y}px`;
    target.addEventListener('click', (event) => {
      event.stopPropagation(); if (!active || target.classList.contains('hit')) return;
      const r = target.getBoundingClientRect(), br = range.getBoundingClientRect(); shootAt(r.left - br.left + r.width/2, r.top - br.top + r.height/2);
      target.classList.add('hit'); score += 1; if (score > best) { best = score; try { localStorage.setItem('podRescueShooterBest', String(best)); } catch (_) {} }
      update(); hintEl.textContent = 'Failed pod terminated. Nice shot!'; setTimeout(() => target.remove(), 200);
    });
    range.appendChild(target);
    setTimeout(() => { if (target.isConnected && !target.classList.contains('hit')) { target.remove(); misses += 1; score = Math.max(0, score - 1); update(); hintEl.textContent = 'A failed pod escaped. Keep an eye on the cluster!'; } }, 1700 + Math.random()*900);
  }
  function startGame() {
    stopTimers(); range.querySelectorAll('.failed-target,.shot-flash').forEach(el => el.remove());
    score = 0; time = 30; misses = 0; active = true; update(); endPanel.hidden = true;
    statusEl.textContent = 'CLUSTER DEFENSE ACTIVE'; hud.textContent = 'TARGETS DETECTED'; hintEl.textContent = 'Shoot the red FAILED pods before they escape.';
    start.disabled = true; start.textContent = 'Defense active…';
    for (let i = 0; i < 3; i++) spawnTarget();
    spawn = setInterval(spawnTarget, 720);
    tick = setInterval(() => { time -= 1; update(); if (time <= 0) endGame(); }, 1000);
  }
  start.addEventListener('click', startGame); again.addEventListener('click', startGame);
  range.addEventListener('click', e => { if (!active || e.target.closest('.failed-target') || e.target.closest('.arcade-end')) return; const r=range.getBoundingClientRect(); shootAt(e.clientX-r.left,e.clientY-r.top); });
})();
