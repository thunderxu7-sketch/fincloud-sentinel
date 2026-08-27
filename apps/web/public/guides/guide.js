(() => {
  const file = location.pathname.split('/').pop() || 'index.html';
  let activeLink;
  document.querySelectorAll('[data-guide-link]').forEach((link) => {
    if (link.getAttribute('href') === `./${file}`) {
      link.classList.add('active');
      activeLink = link;
    }
  });
  requestAnimationFrame(() => activeLink?.scrollIntoView({ block: 'nearest', inline: 'center' }));

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 })
    : null;
  document.querySelectorAll('.reveal').forEach((node) => observer ? observer.observe(node) : node.classList.add('visible'));

  const checks = [...document.querySelectorAll('[data-practice] input[type="checkbox"]')];
  const progress = document.querySelector('[data-progress]');
  const progressText = document.querySelector('[data-progress-text]');
  const storageKey = `fincloud-guide-progress:${file}`;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    checks.forEach((check, index) => { check.checked = Boolean(saved[index]); });
  } catch {}

  const updateProgress = () => {
    const complete = checks.filter((check) => check.checked).length;
    const percent = checks.length ? Math.round((complete / checks.length) * 100) : 0;
    if (progress) progress.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${complete}/${checks.length}`;
    try { localStorage.setItem(storageKey, JSON.stringify(checks.map((check) => check.checked))); } catch {}
  };
  checks.forEach((check) => check.addEventListener('change', updateProgress));
  updateProgress();

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copy);
      if (!target) return;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(target.innerText.trim());
        button.textContent = '已复制';
      } catch {
        button.textContent = '请手动复制';
      }
      setTimeout(() => { button.textContent = original; }, 1600);
    });
  });
})();
