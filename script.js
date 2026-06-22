/* ===========================================================
   YATHARTH TOUR & TRAVELS — INDEX PAGE SCRIPT
   Beginner-friendly: each feature is its own small block.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 2. Dark / Light mode toggle ---------- */
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
  function safeStorageSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

  /* ---------- 3. Mobile nav menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  /* ---------- 4. Sticky header + scroll-to-top button ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 600);
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 5. Scroll reveal animation ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  /* ---------- 5.1 Hero Parallax Effect ---------- */
  const frontRidge = document.querySelector('.ridge-front');
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < 800) {
        if (frontRidge) frontRidge.style.transform = `translateY(${scroll * 0.15}px)`;
        if (heroContent) {
            heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
            heroContent.style.opacity = 1 - (scroll / 600);
        }
    }
  });

  /* ---------- 6. Counters (animate up when visible) ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target;
      let cur = 0; const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => { cur += step; el.textContent = cur >= target ? target.toLocaleString() : cur.toLocaleString(); if (cur < target) requestAnimationFrame(tick); };
      tick();
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.count').forEach(c => counterIO.observe(c));

  /* ---------- 7. Featured packages (just 3, full list lives on packages.html) ---------- */
  const palettes = [
    'linear-gradient(135deg,#2F5C42,#163424)',
    'linear-gradient(135deg,#B5452B,#6E2A1A)',
    'linear-gradient(135deg,#3C6B8A,#1B3548)'
  ];
  const featured = [
    { name:'Shimla Manali Explorer', price:8999, duration:'5D / 4N', dest:'Shimla · Kufri · Manali · Solang Valley' },
    { name:'Churdhar Shrine Trek', price:5999, duration:'2D / 1N', dest:'Chaupal, Shimla — Camping · Guide · Temple Visit' },
    { name:'Jannat-E-Kashmir Premium', price:15999, duration:'7D / 6N', dest:'Srinagar · Gulmarg · Pahalgam · Dal Lake' }
  ];
  const featuredGrid = document.getElementById('featuredGrid');
  featured.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'package-card reveal';
    card.innerHTML = `
      <div class="package-img" style="background:${palettes[i]}" data-duration="${p.duration}"></div>
      <div class="package-body">
        <h3>${p.name}</h3>
        <p class="package-dest">${p.dest}</p>
        <p class="package-price">₹${p.price.toLocaleString('en-IN')} <span>per person</span></p>
        <div class="package-foot">
          <a href="packages.html" class="link-arrow">View Details →</a>
          <a href="contact.html" class="btn btn-ghost btn-sm">Enquire</a>
        </div>
      </div>`;
    featuredGrid.appendChild(card);
    io.observe(card);
  });

  /* ---------- 8. Gallery preview ---------- */
  const galleryItems = ['Maraog','Churdhar','Kashmir','Ladakh','Spiti','Kedarnath'];
  const heights = [220,300,200,260,190,240];
  const galPalette = ['#2F5C42','#B5452B','#3C6B8A','#8B6B2E','#4A7A5E','#C9A227'];
  const masonry = document.getElementById('masonryGallery');
  galleryItems.forEach((name, i) => {
    const div = document.createElement('div');
    div.className = 'ph';
    div.style.height = heights[i] + 'px';
    div.style.background = `linear-gradient(135deg, ${galPalette[i]}, #16241c)`;
    div.textContent = name;
    masonry.appendChild(div);
  });

  /* ---------- 9. Testimonials ---------- */
  const testimonials = [
    { name:'Ritika Sharma', loc:'Delhi', text:'Maraog was a revelation — apple orchards, warm homestays, and a guide who knew every trail by heart.' },
    { name:'Arjun Mehta', loc:'Mumbai', text:'Churdhar trek was perfectly organized — camping, food and safety were all top notch for first timers.' },
    { name:'The Verma Family', loc:'Chandigarh', text:'Our Char Dham Yatra for parents was handled with so much care. Senior-friendly pacing made all the difference.' }
  ];
  const tTrack = document.getElementById('testimonialTrack');
  testimonials.forEach(t => {
    const div = document.createElement('div');
    div.className = 't-card reveal';
    div.innerHTML = `<div class="stars">★★★★★</div><p>"${t.text}"</p><strong>${t.name}</strong><em>${t.loc}</em>`;
    tTrack.appendChild(div); io.observe(div);
  });

  /* ---------- 10. Lead popup (shows once, after 10 seconds) ---------- */
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

  /* ---------- 11. Travel music player ---------- */
  const musicToggle = document.getElementById('musicToggle');
  const musicPanel = document.getElementById('musicPanel');
  const musicPlayPause = document.getElementById('musicPlayPause');
  const musicVolume = document.getElementById('musicVolume');
  const musicTrackName = document.getElementById('musicTrackName');
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = musicVolume.value / 100;

  // Open / close the small music panel
  musicToggle.addEventListener('click', () => musicPanel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!musicPanel.contains(e.target) && e.target !== musicToggle && !musicToggle.contains(e.target)) {
      musicPanel.classList.remove('open');
    }
  });

  let usingFallbackTone = false;
  let fallbackAudioCtx = null, fallbackNodes = [];

  // If no real MP3 file has been added yet, play a soft generated ambient
  // tone instead, so the music button still works out of the box.
  // Replace assets/travel-music.mp3 with a royalty-free track to use real music.
  bgMusic.addEventListener('error', () => { usingFallbackTone = true; });

  function startFallbackTone(volume) {
    if (fallbackAudioCtx) return;
    try {
      fallbackAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const freqs = [196.0, 246.94, 293.66]; // soft G-B-D pad, gentle and non-intrusive
      freqs.forEach((freq, i) => {
        const osc = fallbackAudioCtx.createOscillator();
        const gain = fallbackAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = (volume / 100) * 0.05; // very quiet, ambient pad
        osc.connect(gain).connect(fallbackAudioCtx.destination);
        osc.start();
        fallbackNodes.push({ osc, gain });
      });
    } catch (e) { /* Web Audio not available — silently do nothing */ }
  }
  function stopFallbackTone() {
    fallbackNodes.forEach(n => { try { n.osc.stop(); } catch (e) {} });
    fallbackNodes = [];
    if (fallbackAudioCtx) { fallbackAudioCtx.close(); fallbackAudioCtx = null; }
  }
  function setFallbackVolume(volume) {
    fallbackNodes.forEach(n => { n.gain.gain.value = (volume / 100) * 0.05; });
  }

  let isPlaying = false;
  musicPlayPause.addEventListener('click', () => {
    if (!isPlaying) {
      bgMusic.play().catch(() => { usingFallbackTone = true; });
      if (usingFallbackTone) startFallbackTone(musicVolume.value);
      isPlaying = true;
      musicPlayPause.textContent = '⏸';
      musicToggle.classList.add('playing');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicTrackName.textContent = usingFallbackTone
        ? 'Ambient Travel Pad (demo tone)'
        : 'Himalayan Breeze — Ambient Travel Loop';
    } else {
      bgMusic.pause();
      stopFallbackTone();
      isPlaying = false;
      musicPlayPause.textContent = '▶';
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  musicVolume.addEventListener('input', () => {
    bgMusic.volume = musicVolume.value / 100;
    setFallbackVolume(musicVolume.value);
  });

  /* ---------- 12. Global Button Sound ---------- */
  const bellSound = new Audio('assets/bell.mp3');
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .btn, .icon-btn, .filter-btn, .link-arrow, .nav-toggle, .float-btn')) {
      bellSound.currentTime = 0;
      bellSound.play().catch(() => { /* Autoplay block handle */ });
    }
  });

});
