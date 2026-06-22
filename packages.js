/* ===========================================================
   YATHARTH TOUR & TRAVELS — PACKAGES PAGE SCRIPT
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

  /* ---------- Full package dataset (all 15) ---------- */
  const palettes = [
    'linear-gradient(135deg,#2F5C42,#163424)','linear-gradient(135deg,#B5452B,#6E2A1A)',
    'linear-gradient(135deg,#3C6B8A,#1B3548)','linear-gradient(135deg,#8B6B2E,#4A3A14)',
    'linear-gradient(135deg,#4A7A5E,#1F4032)','linear-gradient(135deg,#C9A227,#7A5E10)'
  ];

  /* ---------- Logic: 10 PM Daily Reset Timer ---------- */
  function updateOfferTimer() {
    const now = new Date();
    let target = new Date();
    target.setHours(22, 0, 0, 0); // 10:00 PM

    // If it's already past 10 PM today, set target to 10 PM tomorrow
    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }

    const diff = target - now;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const hEl = document.getElementById('t-hours');
    const mEl = document.getElementById('t-mins');
    const sEl = document.getElementById('t-secs');

    if (hEl) hEl.textContent = h.toString().padStart(2, '0');
    if (mEl) mEl.textContent = m.toString().padStart(2, '0');
    if (sEl) sEl.textContent = s.toString().padStart(2, '0');
  }
  setInterval(updateOfferTimer, 1000);
  updateOfferTimer();

  /* ---------- Package Logic: Data with DNA attributes ---------- */
  const packages = [
    { name:'Shimla Manali Explorer', price:8999, duration:'5D / 4N', cat:'himachal', day:5, night:4, hotel:true, camp:false, sites:true,
      dest:['Shimla','Kufri','Manali','Solang Valley','Mall Road'], includes:['Hotel Stay','Breakfast & Dinner','Local Sightseeing','Private Transport'] },
    { name:'Shimla Kullu Manali Manikaran', price:10999, duration:'6D / 5N', cat:'himachal', day:6, night:5, hotel:true, camp:false, sites:true,
      dest:['Shimla','Kullu','Manali','Manikaran Sahib','Solang Valley'], includes:['Hotels','Meals','Sightseeing','Transport'] },
    { name:'Kashmir Tour Special', price:12999, duration:'6D / 5N', cat:'kashmir-ladakh', day:6, night:5, hotel:true, camp:false, sites:true,
      dest:['Srinagar','Gulmarg','Sonmarg','Pahalgam'], includes:['Hotel','Transport','Sightseeing'] },
    { name:'Kullu Manali Adventure', price:7999, duration:'4D / 3N', cat:'himachal', day:4, night:3, hotel:true, camp:false, sites:true,
      dest:['Kullu','Manali'], includes:['Hotel','Breakfast','Sightseeing'] },
    { name:'Jannat-E-Kashmir Premium', price:15999, duration:'7D / 6N', cat:'kashmir-ladakh', day:7, night:6, hotel:true, camp:false, sites:true,
      dest:['Srinagar','Gulmarg','Pahalgam','Sonmarg','Dal Lake'], includes:['Hotel','Houseboat Stay','Transport','Sightseeing'] },
    { name:'Char Dham Yatra For Parents', price:28999, duration:'10D / 9N', cat:'pilgrimage', day:10, night:9, hotel:true, camp:false, sites:true, note:'Senior Citizen Assistance',
      dest:['Yamunotri','Gangotri','Kedarnath','Badrinath'], includes:['Hotel','Meals','Transport','Senior Citizen Assistance'] },
    { name:'Ladakh Family & Friends Expedition', price:22999, duration:'7D / 6N', cat:'kashmir-ladakh', day:7, night:6, hotel:true, camp:true, sites:true,
      dest:['Leh','Nubra Valley','Pangong Lake','Khardung La'], includes:['Hotel/Camps','Permits','Transport','Oxygen Support'] },
    { name:'Kedarnath Badrinath Pilgrimage', price:14999, duration:'5D / 4N', cat:'pilgrimage', day:5, night:4, hotel:true, camp:false, sites:true,
      dest:['Kedarnath','Badrinath'], includes:['Hotel','Meals','Transport'] },
    { name:'Vrindavan Spiritual Tour', price:6999, duration:'3D / 2N', cat:'pilgrimage', day:3, night:2, hotel:true, camp:false, sites:true,
      dest:['Vrindavan','Mathura','Govardhan'], includes:['Hotel','Meals','Local Transport'] },
    { name:'Complete Himachal Circuit', price:16999, duration:'8D / 7N', cat:'himachal', day:8, night:7, hotel:true, camp:false, sites:true,
      dest:['Shimla','Kullu','Manali','Dharamshala','Dalhousie','Khajjiar'], includes:['Hotel','Breakfast & Dinner','Transport','Sightseeing'] },
    { name:'Students, Schools & Colleges Special', price:5000, duration:'Custom', cat:'offbeat', day:'?', night:'?', hotel:true, camp:true, sites:true, from:true,
      dest:['Schools','Colleges','Institutes','Corporate Groups'], includes:['Transport','Stay','Meals','Activities'] },
    { name:'Spiti Valley Expedition', price:19999, duration:'8D / 7N', cat:'offbeat', day:8, night:7, hotel:true, camp:true, sites:true,
      dest:['Kaza','Tabo','Langza','Hikkim','Key Monastery'], includes:['Hotel/Homestay','Transport','Permits','Sightseeing'] },
    { name:'Ayodhya Nepal Spiritual Journey', price:5000, duration:'Group Departure', cat:'pilgrimage', day:12, night:11, hotel:true, camp:false, sites:true, from:true, note:'Group Bus Booking Available',
      dest:['Ayodhya','Kashi','Haridwar','Janakpur','Pashupatinath','Pokhara'], includes:['Bus Transport','Stay','Meals'] },
    { name:'Churdhar Shrine Trek', price:5999, duration:'2D / 1N', cat:'offbeat', day:2, night:1, hotel:false, camp:true, sites:true, img:'assets/Maraog 2.jpg',
      dest:['Chaupal, Shimla'], includes:['Camping','Guide','Trekking Support','Temple Visit','Photography Stops'] },
    { name:'Maraog Village Experience', price:2999, duration:'1 Day', cat:'offbeat', day:1, night:0, hotel:true, camp:false, sites:true, img:'assets/Maraog 1.jpg',
      dest:['Maraog Village'], includes:['Village Walk','Apple Orchard Tour','Local Food Experience','Photography Tour','Cultural Experience'] }
  ];

  const grid = document.getElementById('packagesGrid');

  /* ---------- Render Logic: DNA Graphics Injection ---------- */
  function renderPackages(filter) {
    grid.innerHTML = '';
    packages.filter(p => filter === 'all' || p.cat === filter).forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'package-card reveal';
      
      // Itinerary DNA HTML structure
      const dnaHtml = `
        <div class="package-dna">
          <div class="dna-item dna-active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            <span>${p.day} D</span>
          </div>
          <div class="dna-item dna-active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            <span>${p.night} N</span>
          </div>
          <div class="dna-item ${p.hotel ? 'dna-active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Hotel</span>
          </div>
          <div class="dna-item ${p.camp ? 'dna-active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.39 5L21 21H3L7.61 5"/><path d="M12 2v3"/><path d="M8 5h8"/></svg>
            <span>Camp</span>
          </div>
          <div class="dna-item ${p.sites ? 'dna-active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M9 22h6"/><path d="M12 18v4"/><path d="M12 2v2"/><circle cx="12" cy="12" r="10"/></svg>
            <span>Sightseeing</span>
          </div>
        </div>
      `;

      card.innerHTML = `
        <div class="package-img" style="background:${p.img ? `url('${p.img}') center/cover` : palettes[i % palettes.length]}" data-duration="${p.duration}">
        </div>
        <div class="package-body">
          <h3>${p.name}</h3>
          <p class="package-dest">${p.dest.join(' · ')}</p>
          ${p.note ? `<p class="package-dest" style="color:var(--gold)">★ ${p.note}</p>` : ''}
          <p class="package-price">${p.from ? 'From ' : ''}₹${p.price.toLocaleString('en-IN')} <span>per person</span></p>
          <div class="package-foot">
            <button type="button" class="link-arrow toggle-details">View Details →</button>
            <a href="contact.html" class="btn btn-ghost btn-sm">Enquire</a>
          </div>
        </div>
        ${dnaHtml}
        <div class="package-details">
          <div class="package-details-inner">
            <span class="label">What's Included</span>
            <ul>${p.includes.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
        </div>`;
      grid.appendChild(card);
      io.observe(card);

      const toggleBtn = card.querySelector('.toggle-details');
      const details = card.querySelector('.package-details');
      toggleBtn.addEventListener('click', () => {
        const isOpen = details.classList.toggle('open');
        toggleBtn.textContent = isOpen ? 'Hide Details ↑' : 'View Details →';
      });
    });
  }
  renderPackages('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPackages(btn.dataset.filter);
    });
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
