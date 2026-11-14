/*
  ╔══════════════════════════════════════════════════╗
  ║  Turkish Wedding Invitation - Main JavaScript    ║
  ║  Features: Countdown, Particles, Guestbook,      ║
  ║  Music Toggle, Scroll Reveal, Smooth Scroll      ║
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
});

/* ===== Loading Screen ===== */
function initLoadingScreen() {
  const loader = document.querySelector('.loading-screen');
  if (!loader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }, 1500);
  });
  
  // Fallback: hide after 4s regardless
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }
  }, 4000);
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ===== Scroll to Top ===== */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
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
      this.opacity = Math.random() * 0.5 + 0.1;
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

  // Create particles
  const count = Math.min(40, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // Start scattered
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

/* ===== Music Toggle ===== */
function initMusicToggle() {
  const toggle = document.querySelector('.music-toggle');
  const audio = document.getElementById('bg-music');
  const soundBars = document.querySelector('.sound-bars');
  if (!toggle || !audio) return;

  let isPlaying = false;

  toggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      toggle.classList.remove('playing');
      if (soundBars) soundBars.classList.remove('playing');
    } else {
      audio.play().catch(() => {
        console.log('Audio playback requires user interaction');
      });
      toggle.classList.add('playing');
      if (soundBars) soundBars.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  // Try autoplay on first user interaction
  function firstInteraction() {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        toggle.classList.add('playing');
        if (soundBars) soundBars.classList.add('playing');
      }).catch(() => {});
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

  // Load existing wishes
  function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    // Add demo wishes if empty
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

  // Handle form submit
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

    // Reset form
    nameInput.value = '';
    messageInput.value = '';

    // Show success feedback
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
