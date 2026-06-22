/* ===========================================================
   YATHARTH TOUR & TRAVELS — CONTACT PAGE SCRIPT
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Shared header/utility behaviors (same as other pages) ---------- */

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = safeStorageGet('yt-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    safeStorageSet('yt-theme', next);
  });
  function safeStorageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeStorageSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('show', window.scrollY > 600));
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Music player
  const musicToggle = document.getElementById('musicToggle');
  const musicPanel = document.getElementById('musicPanel');
  const musicPlayPause = document.getElementById('musicPlayPause');
  const musicVolume = document.getElementById('musicVolume');
  const musicTrackName = document.getElementById('musicTrackName');
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = musicVolume.value / 100;
  musicToggle.addEventListener('click', () => musicPanel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!musicPanel.contains(e.target) && e.target !== musicToggle && !musicToggle.contains(e.target)) {
      musicPanel.classList.remove('open');
    }
  });
  let usingFallbackTone = false, fallbackAudioCtx = null, fallbackNodes = [];
  bgMusic.addEventListener('error', () => { usingFallbackTone = true; });
  function startFallbackTone(volume) {
    if (fallbackAudioCtx) return;
    try {
      fallbackAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      [196.0, 246.94, 293.66].forEach((freq) => {
        const osc = fallbackAudioCtx.createOscillator(), gain = fallbackAudioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq; gain.gain.value = (volume / 100) * 0.05;
        osc.connect(gain).connect(fallbackAudioCtx.destination); osc.start();
        fallbackNodes.push({ osc, gain });
      });
    } catch (e) {}
  }
  function stopFallbackTone() {
    fallbackNodes.forEach(n => { try { n.osc.stop(); } catch (e) {} });
    fallbackNodes = [];
    if (fallbackAudioCtx) { fallbackAudioCtx.close(); fallbackAudioCtx = null; }
  }
  let isPlaying = false;
  musicPlayPause.addEventListener('click', () => {
    if (!isPlaying) {
      bgMusic.play().catch(() => { usingFallbackTone = true; });
      if (usingFallbackTone) startFallbackTone(musicVolume.value);
      isPlaying = true; musicPlayPause.textContent = '⏸';
      musicToggle.classList.add('playing'); musicToggle.setAttribute('aria-pressed', 'true');
      musicTrackName.textContent = usingFallbackTone ? 'Ambient Travel Pad (demo tone)' : 'Himalayan Breeze — Ambient Travel Loop';
    } else {
      bgMusic.pause(); stopFallbackTone();
      isPlaying = false; musicPlayPause.textContent = '▶';
      musicToggle.classList.remove('playing'); musicToggle.setAttribute('aria-pressed', 'false');
    }
  });
  musicVolume.addEventListener('input', () => {
    bgMusic.volume = musicVolume.value / 100;
    fallbackNodes.forEach(n => { n.gain.gain.value = (musicVolume.value / 100) * 0.05; });
  });

  /* ---------- Pre-fill destination if arriving from a package link ---------- */
  /* e.g. contact.html?destination=Churdhar%20Trek will pre-select that option */
  const params = new URLSearchParams(window.location.search);
  const destParam = params.get('destination');
  const destinationSelect = document.getElementById('destinationSelect');
  if (destParam && destinationSelect) {
    const match = Array.from(destinationSelect.options).find(
      opt => opt.textContent.toLowerCase().includes(destParam.toLowerCase())
    );
    if (match) destinationSelect.value = match.value;
  }

  /* ---------- Contact form submit ---------- */
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contactSuccess').textContent = '✓ Thanks! Our travel expert will call you within 1 hour.';
    e.target.reset();
  });

  /* ---------- Global Button Sound ---------- */
  const bellSound = new Audio('assets/bell.mp3');
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .btn, .icon-btn, .filter-btn, .link-arrow, .nav-toggle, .float-btn')) {
      bellSound.currentTime = 0;
      bellSound.play().catch(() => {});
    }
  });

});
