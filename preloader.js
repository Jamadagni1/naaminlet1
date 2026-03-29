(function () {
  const pre = document.getElementById('naamin-preloader');
  if (!pre) return;

  const minDuration = 250;   // minimum loader time (ms) — shortened for faster perceived load
  const maxWait = 1000;      // hard fallback (ms)
  const start = Date.now();
  let hidden = false;

  function stopAnimations() {
    pre.querySelectorAll('*').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

  function hide() {
    if (hidden) return;
    hidden = true;

    stopAnimations();
    pre.classList.add('fade-out');
    document.body.classList.remove('preloader-active');

    setTimeout(() => {
      try { pre.remove(); } catch (e) {}
      document.body.style.overflow = '';
    }, 420);
  }

  function startIDot() {
    const iDot = pre.querySelector('.i-dot');
    if (iDot) iDot.classList.add('animate');
  }

  // Prefer hiding as soon as DOM is ready (faster than waiting for full load)
  window.addEventListener('DOMContentLoaded', () => {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minDuration - elapsed);
    setTimeout(hide, wait);
  });

  // fallback: ensure preloader removed if something blocks DOMContentLoaded
  setTimeout(hide, maxWait);

  // Start the i-dot motion shortly after letters reveal
  setTimeout(startIDot, 260);
})();
