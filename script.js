const result = document.getElementById('terminalResult');
const input = document.getElementById('terminalInput');
const form = document.getElementById('terminalForm');
const commands = {
  help: 'Available commands: about, skills, projects, impact, experience, contact, clear',
  about: 'Jisna C John — CKA-certified DevOps Engineer with 4.5+ years building cloud and Kubernetes platforms, automation, observability, and AI application delivery.',
  skills: 'Cloud: AWS, Azure, GCP, DigitalOcean\nContainers: Kubernetes, Docker, Helm\nIaC & delivery: Terraform, Ansible, GitHub Actions, Azure DevOps, Argo CD\nAI application delivery: Ollama, FastAPI, MCP integration\nSecurity: IAM, Vault, External Secrets Operator\nObservability: Prometheus, Grafana, Loki, Tempo, VictoriaLogs',
  projects: 'Lucius AI — AI browser-automation SaaS infrastructure\nPerfAgents — Kubernetes performance-testing platform\nVexabot AI — Ollama-served chatbot deployment\nPlatformPilot — Go + Kubernetes engineering lab\nLLM on Kubernetes — personal engineering lab in progress',
  impact: '95% faster environment provisioning\n80% less manual release effort\n40% higher concurrent test capacity\n25% lower environment cost\n40% lower mean time to detect\nThese are outcomes reported in my resume and project experience.',
  experience: 'Testing Mavens (Oct 2025–present)\nSayone Technologies (May 2024–Sep 2025)\nInnovature Labs (Apr 2022–Mar 2024)',
  contact: 'Email: johnjisna66@gmail.com\nLinkedIn: linkedin.com/in/johnjisna\nGitHub: github.com/johnjisna',
  clear: ''
};
function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  if (command === 'clear') { result.textContent = 'Terminal cleared. Try: help, skills, projects, impact, contact'; return; }
  result.textContent = commands[command] || `Command not found: ${command}\nType "help" to see available commands.`;
}
if (form && input && result) {
  form.addEventListener('submit', e => { e.preventDefault(); runCommand(input.value); input.value = ''; });
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => runCommand(button.dataset.command)));
}
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}
