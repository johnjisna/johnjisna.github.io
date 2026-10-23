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
