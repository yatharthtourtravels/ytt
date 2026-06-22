/* ===========================================================
   YATHARTH TOUR & TRAVELS — ABOUT PAGE SCRIPT
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Shared header/utility behaviors (same as index.html) ---------- */

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

  // Lead popup
  const overlay = document.getElementById('leadModalOverlay');
  const closeBtn = document.getElementById('leadModalClose');
  function openModal() {
    if (sessionFlag('yt-lead-shown')) return;
    overlay.classList.add('show');
    setSessionFlag('yt-lead-shown');
  }
  function sessionFlag(key) { try { return sessionStorage.getItem(key); } catch (e) { return window.__ytFlag === key; } }
  function setSessionFlag(key) { try { sessionStorage.setItem(key, '1'); } catch (e) { window.__ytFlag = key; } }
  setTimeout(openModal, 10000);
  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('show'); });
  document.getElementById('leadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    overlay.querySelector('.lead-modal').innerHTML = '<p class="form-success" style="font-size:1rem;">✓ Thanks! Our travel expert will call you within 1 hour.</p>';
    setTimeout(() => overlay.classList.remove('show'), 2200);
  });

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

  /* ---------- Maraog gallery ---------- */
  const galleryItems = ['Apple Orchards','Mountain Viewpoint','Village Homestay','Forest Trail','Ancient Temple','Churdhar Ridge'];
  const heights = [240,310,200,270,190,250];
  const galPalette = ['#2F5C42','#B5452B','#3C6B8A','#4A7A5E','#8B6B2E','#1F4032'];
  const masonry = document.getElementById('maraogGallery');
  galleryItems.forEach((name, i) => {
    const div = document.createElement('div');
    div.className = 'ph';
    div.style.height = heights[i] + 'px';
    div.style.background = `linear-gradient(135deg, ${galPalette[i]}, #16241c)`;
    div.textContent = name;
    masonry.appendChild(div);
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
