/*
  ╔══════════════════════════════════════════════════╗
  ║  Turkish Wedding Invitation - Main JavaScript    ║
  ║  Features: Countdown, Particles, Guestbook,      ║
  ║  Music Toggle (HTML5 Audio + WebAudio Synth),    ║
  ║  Interactive Envelope, Scroll Reveal             ║
  ╚══════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initScrollReveal();
  initScrollToTop();
  initCountdown();
  initParticles();
  initMusicToggle();
  initGuestbook();
  initEnvelopeInteraction();
});

/* ===== Loading Screen ===== */
function initLoadingScreen() {
  const loader = document.querySelector('.loading-screen');
  if (!loader) return;
  
  function hideLoader() {
    if (loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    setTimeout(() => {
      try { loader.remove(); } catch(e) {}
    }, 600);
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 500);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 500));
  }
  
  // Safe fallback (never block the user for more than 1.2s)
  setTimeout(hideLoader, 1200);
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  // Immediately reveal sections in or near the viewport
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      section.classList.add('revealed');
    }
  });

  document.body.classList.add('has-scroll-anim');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '100px 0px 50px 0px'
  });

  sections.forEach(section => {
    if (!section.classList.contains('revealed')) {
      observer.observe(section);
    }
  });
}

/* ===== Interactive Envelope ===== */
function initEnvelopeInteraction() {
  const envelope = document.querySelector('.envelope-graphic');
  const seal = document.querySelector('.envelope-seal');
  if (!envelope) return;

  function openEnvelope() {
    envelope.classList.toggle('opened');
    
    // Smooth scroll down to main invitation card
    const card = document.querySelector('.invitation-card');
    if (card) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  }

  if (seal) seal.addEventListener('click', openEnvelope);
  envelope.addEventListener('click', openEnvelope);
}

/* ===== Scroll to Top ===== */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Countdown Timer ===== */
function initCountdown() {
  const countdownEl = document.querySelector('[data-countdown]');
  if (!countdownEl) return;

  const targetDate = new Date(countdownEl.dataset.countdown).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.querySelectorAll('.countdown-number').forEach(el => el.textContent = '0');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ===== Floating Particles ===== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 4 + 2;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.type = Math.random() > 0.5 ? 'heart' : 'star';
      this.color = Math.random() > 0.5 ? '#c9a84c' : '#e8d5a3';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.001;

      if (this.y < -20 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        this.drawHeart(this.size);
      } else {
        this.drawStar(this.size);
      }

      ctx.restore();
    }

    drawHeart(size) {
      ctx.beginPath();
      const x = 0, y = 0;
      ctx.moveTo(x, y + size / 4);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.7, x, y + size);
      ctx.bezierCurveTo(x, y + size * 0.7, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
      ctx.fill();
    }

    drawStar(size) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  const count = Math.min(35, Math.floor(window.innerWidth / 28));
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animId = requestAnimationFrame(animate);
  }

  animate();
}

/* ===== Ambient Turkish Romantic Melodic Synthesizer ===== */
// Uses Web Audio API to play a soothing, romantic acoustic Oud/Kanun-inspired melody
class TurkishMelodySynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    // Turkish Nihavend / Rast romantic acoustic notes (frequencies in Hz)
    this.notes = [
      220.00, // A3
      246.94, // B3
      261.63, // C4
      293.66, // D4
      329.63, // E4
      349.23, // F4
      392.00, // G4
      440.00, // A4
      493.88, // B4
      523.25, // C5
      587.33  // D5
    ];
    // Romantic melody pattern (indices into this.notes)
    this.melody = [
      { n: 4, d: 0.6 }, { n: 6, d: 0.4 }, { n: 7, d: 0.8 },
      { n: 6, d: 0.4 }, { n: 4, d: 0.6 }, { n: 3, d: 0.8 },
      { n: 2, d: 0.4 }, { n: 3, d: 0.4 }, { n: 4, d: 0.8 },
      { n: 2, d: 0.6 }, { n: 0, d: 1.0 },
      // Second phrase
      { n: 4, d: 0.5 }, { n: 7, d: 0.5 }, { n: 9, d: 0.9 },
      { n: 8, d: 0.4 }, { n: 7, d: 0.6 }, { n: 6, d: 0.8 },
      { n: 4, d: 0.4 }, { n: 3, d: 0.4 }, { n: 2, d: 0.8 },
      { n: 0, d: 1.2 }
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPluck(freq, duration) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Main warm oscillator (triangle for acoustic wood resonance)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle overtone for plucked string authenticity
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Low-pass filter simulating wooden acoustic body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);

    // Gain envelope with soft gentle pluck
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.03, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration * 1.6);
    osc2.stop(now + duration * 1.6);
  }

  start() {
    this.initContext();
    this.isPlaying = true;
    this.step = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const item = this.melody[this.step % this.melody.length];
      const freq = this.notes[item.n];
      this.playPluck(freq, item.d);
      
      this.step++;
      const nextDelay = (item.d * 1000) + 150;
      this.timer = setTimeout(playNext, nextDelay);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

const synthPlayer = new TurkishMelodySynth();

/* ===== Music Toggle ===== */
function initMusicToggle() {
  const toggle = document.querySelector('.music-toggle');
  const audio = document.getElementById('bg-music');
  const soundBars = document.querySelector('.sound-bars');
  if (!toggle) return;

  let isPlaying = false;
  const hasAudioSource = audio && audio.querySelector('source') && audio.querySelector('source').getAttribute('src');

  function startMusic() {
    isPlaying = true;
    toggle.classList.add('playing');
    if (soundBars) soundBars.classList.add('playing');

    if (hasAudioSource) {
      audio.play().catch(() => {
        synthPlayer.start();
      });
    } else {
      synthPlayer.start();
    }
  }

  function stopMusic() {
    isPlaying = false;
    toggle.classList.remove('playing');
    if (soundBars) soundBars.classList.remove('playing');

    if (hasAudioSource) {
      audio.pause();
    }
    synthPlayer.stop();
  }

  toggle.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Autoplay attempt on first user touch/click
  function firstInteraction() {
    if (!isPlaying) {
      startMusic();
    }
    document.removeEventListener('click', firstInteraction);
    document.removeEventListener('touchstart', firstInteraction);
  }

  document.addEventListener('click', firstInteraction, { once: true });
  document.addEventListener('touchstart', firstInteraction, { once: true });
}

/* ===== Guestbook ===== */
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const feed = document.getElementById('wishes-feed');
  if (!form || !feed) return;

  const pageKey = document.body.dataset.page || 'default';
  const storageKey = `wedding_wishes_${pageKey}`;

  function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (wishes.length === 0) {
      const demoWishes = getDemoWishes(pageKey);
      demoWishes.forEach(w => wishes.push(w));
      localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
    renderWishes(wishes);
  }

  function renderWishes(wishes) {
    feed.innerHTML = wishes.map(wish => `
      <div class="wish-card">
        <div class="wish-author">${escapeHtml(wish.name)}</div>
        <div class="wish-message">${escapeHtml(wish.message)}</div>
        <div class="wish-time">${wish.time}</div>
      </div>
    `).reverse().join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getDemoWishes(page) {
    if (page === 'groom') {
      return [
        { name: 'Ahmet Yılmaz', message: 'Ömür boyu mutluluklar diliyorum! Allah bir yastıkta kocatsın. 🤲', time: '2 saat önce' },
        { name: 'Fatma Demir', message: 'Ne güzel bir çift olmuşsunuz! Düğününüz hayırlı olsun! 💐', time: '5 saat önce' },
        { name: 'Mehmet Kaya', message: 'Tebrikler kardeşim! Yuvanız daim, sevginiz sonsuz olsun! 🎉', time: '1 gün önce' },
        { name: 'Elif Şahin', message: 'Masallah! Gözünüz aydın olsun, hayırlı uğurlu olsun! ❤️', time: '2 gün önce' },
      ];
    } else {
      return [
        { name: 'Zeynep Aksoy', message: 'Kınana çok güzeldi canım! Allah mesut etsin ikinizi de! 🧿', time: '3 saat önce' },
        { name: 'Ayşe Korkmaz', message: 'En güzel gelin sen oldun! Ömür boyu mutluluklar! 👰💕', time: '6 saat önce' },
        { name: 'Selin Yıldız', message: 'Masallah masallah! Kına geceniz çok eğlenceliydi! 🎶', time: '1 gün önce' },
        { name: 'Derya Öztürk', message: 'İkinize de ömür boyu sağlık ve mutluluk diliyorum! 🌹', time: '2 gün önce' },
      ];
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = form.querySelector('[name="guest-name"]');
    const messageInput = form.querySelector('[name="guest-message"]');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) return;

    const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    wishes.push({
      name,
      message,
      time: 'Şimdi'
    });
    
    localStorage.setItem(storageKey, JSON.stringify(wishes));
    renderWishes(wishes);

    nameInput.value = '';
    messageInput.value = '';

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Gönderildi!';
    btn.style.background = '#4caf50';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  });

  loadWishes();
}

/* ===== Smooth Scroll for Anchor Links ===== */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
