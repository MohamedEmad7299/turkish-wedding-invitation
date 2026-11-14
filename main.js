/*
  ============================================================
  THE ROYAL WEDDING OF ALEXANDER & SOPHIA
  Client Script: Countdown, Real Audio Player, RSVP & Guestbook
  ============================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAudioPlayer();
  initRSVPForm();
  initGuestbook();
  initSmoothScroll();
});

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
function initCountdown() {
  const container = document.querySelector('[data-countdown]');
  if (!container) return;

  const targetDate = new Date(container.dataset.countdown).getTime();
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   ROYAL AUDIO PLAYER (CANON IN D MAJOR & ACOUSTIC SUITE)
   ============================================================ */
function initAudioPlayer() {
  const playerBtn = document.getElementById('audio-player-btn');
  const audioElement = document.getElementById('wedding-audio');
  if (!playerBtn || !audioElement) return;

  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      playerBtn.classList.remove('playing');
      const label = playerBtn.querySelector('.audio-label');
      if (label) label.textContent = 'Play Music';
    } else {
      audioElement.play().then(() => {
        isPlaying = true;
        playerBtn.classList.add('playing');
        const label = playerBtn.querySelector('.audio-label');
        if (label) label.textContent = 'Playing Music';
      }).catch(err => {
        console.log('Playback requires user gesture:', err);
      });
    }
  }

  playerBtn.addEventListener('click', togglePlay);

  // Auto-play attempt on first user click anywhere on page
  function firstInteraction() {
    if (!isPlaying) {
      audioElement.play().then(() => {
        isPlaying = true;
        playerBtn.classList.add('playing');
        const label = playerBtn.querySelector('.audio-label');
        if (label) label.textContent = 'Playing Music';
      }).catch(() => {});
    }
    document.removeEventListener('click', firstInteraction);
  }

  document.addEventListener('click', firstInteraction, { once: true });
}

/* ============================================================
   INTERACTIVE RSVP FORM
   ============================================================ */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="guest_name"]')?.value || '';
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
    const guests = form.querySelector('[name="guest_count"]')?.value || '1';
    const diet = form.querySelector('[name="dietary"]')?.value || 'None';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Confirming RSVP...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem('luxury_rsvp_submissions') || '[]');
      existing.push({
        name,
        attendance,
        guests,
        diet,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      localStorage.setItem('luxury_rsvp_submissions', JSON.stringify(existing));

      // Show confirmation message
      form.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 50px; height: 50px; margin: 0 auto 1rem; border-radius: 50%; border: 1.5px solid #b89340; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#b89340">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h4 style="font-family: 'Cinzel', serif; font-size: 1.25rem; color: #0e2238; margin-bottom: 0.5rem; letter-spacing: 1px;">
            Thank You, ${escapeHtml(name)}
          </h4>
          <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; color: #5e5e5e; line-height: 1.8;">
            Your response has been formally received. We eagerly look forward to celebrating with you in Istanbul.
          </p>
        </div>
      `;
    }, 700);
  });
}

/* ============================================================
   GUESTBOOK OF CONGRATULATIONS
   ============================================================ */
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const feed = document.getElementById('guestbook-feed');
  if (!feed) return;

  const storageKey = 'wedding_guestbook_wishes_en';

  const defaultWishes = [
    {
      name: 'Lord & Lady Harrington',
      message: 'Sending our warmest congratulations to Alexander and Sophia. Istanbul is the most magnificent setting for such a regal union.',
      time: '2 hours ago'
    },
    {
      name: 'Victoria & Julian Sterling',
      message: 'To a lifetime of love, laughter, and grand adventures. We cannot wait to toast with you at Çırağan Palace.',
      time: '5 hours ago'
    },
    {
      name: 'Dr. Marcus Vance',
      message: 'May your marriage be blessed with unending joy and mutual devotion. Looking forward to celebrating on the Bosphorus.',
      time: 'Yesterday'
    },
    {
      name: 'Eleanor & Charles Beaumont',
      message: 'A truly breathtaking couple. Wishing you both a glorious wedding celebration and a lifetime of shared happiness.',
      time: '2 days ago'
    }
  ];

  function loadWishes() {
    let wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (wishes.length === 0) {
      wishes = defaultWishes;
      localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
    renderWishes(wishes);
  }

  function renderWishes(wishes) {
    feed.innerHTML = wishes.map(w => `
      <div class="guestbook-entry">
        <div class="entry-author">${escapeHtml(w.name)}</div>
        <div class="entry-body">${escapeHtml(w.message)}</div>
        <div class="entry-time">${w.time}</div>
      </div>
    `).reverse().join('');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('[name="author_name"]');
      const msgInput = form.querySelector('[name="author_message"]');
      const name = nameInput.value.trim();
      const message = msgInput.value.trim();

      if (!name || !message) return;

      const wishes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      wishes.push({
        name,
        message,
        time: 'Just now'
      });
      localStorage.setItem(storageKey, JSON.stringify(wishes));
      renderWishes(wishes);

      nameInput.value = '';
      msgInput.value = '';

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Message Sent';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  }

  loadWishes();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ============================================================
   SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
