/* ============================================
   MOTHER JOHNSON - WEBSITE SCRIPTS
   90s Retro Effects & Interactivity
   ============================================ */

// --- STAR FIELD GENERATOR ---
(function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--delay', (Math.random() * 3) + 's');
    star.style.width = star.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(star);
  }
})();

// --- SCROLL FADE-IN ANIMATIONS ---
(function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

// --- LIGHTBOX ---
function openLightbox(item) {
  const img = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// --- VISITOR COUNTER (fake, increments from localStorage) ---
(function visitorCounter() {
  const el = document.getElementById('visitor-count');
  if (!el) return;
  let count = parseInt(localStorage.getItem('mj-visitors') || '847');
  if (!localStorage.getItem('mj-visited-' + document.title)) {
    count += Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('mj-visitors', count);
    localStorage.setItem('mj-visited-' + document.title, '1');
  }
  el.textContent = String(count).padStart(6, '0');
})();

// --- NAV: close mobile menu on link click ---
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('nav ul').classList.remove('open');
  });
});

// --- NAV: hide/show on scroll ---
(function navScrollBehavior() {
  let lastScroll = 0;
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      nav.style.borderBottomColor = 'var(--purple-dark)';
    }
    lastScroll = currentScroll;
  });
})();

// --- CURSOR TRAIL (subtle purple sparks) ---
(function cursorTrail() {
  let throttle = false;
  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => throttle = false, 60);

    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: var(--purple-glow);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      box-shadow: 0 0 6px var(--purple-glow);
      transition: all 0.6s ease;
    `;
    document.body.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.opacity = '0';
      spark.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px) scale(0)`;
    });

    setTimeout(() => spark.remove(), 600);
  });
})();

// --- FORM HANDLERS ---

function handleBooking(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  // Build mailto link
  const subject = encodeURIComponent('Booking Request: ' + (data.get('venue') || 'Unknown Venue'));
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\n` +
    `Email: ${data.get('email')}\n` +
    `Venue: ${data.get('venue')}\n` +
    `City: ${data.get('city')}\n` +
    `Date: ${data.get('date')}\n` +
    `Message: ${data.get('message')}`
  );

  // Show confirmation
  const btn = form.querySelector('.submit-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '&#10003; REQUEST SENT';
  btn.style.background = 'var(--purple)';
  btn.style.color = 'var(--white)';

  // Open email client
  window.location.href = `mailto:motherjohnsonband@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.style.color = '';
    form.reset();
  }, 3000);
}

function handleOrder(item) {
  const subject = encodeURIComponent('Order: ' + item);
  const body = encodeURIComponent(
    `Hi Mother Johnson,\n\nI'd like to order: ${item}\n\nPlease send me payment and shipping details.\n\nName: \nAddress: \n\nThanks!`
  );
  window.location.href = `mailto:motherjohnsonband@gmail.com?subject=${subject}&body=${body}`;
}

function handleDonate(amount) {
  let subject, body;
  if (amount === 'custom') {
    subject = encodeURIComponent('Donation for Mother Johnson');
    body = encodeURIComponent('Hi Mother Johnson,\n\nI\'d like to make a donation to support the band. Please send me your payment details.\n\nAmount: [your amount]\n\nThanks!');
  } else {
    subject = encodeURIComponent('Donation: €' + amount);
    body = encodeURIComponent(`Hi Mother Johnson,\n\nI'd like to donate €${amount} to support the band. Please send me your payment details.\n\nThanks!`);
  }
  window.location.href = `mailto:motherjohnsonband@gmail.com?subject=${subject}&body=${body}`;
}

function handleGuestbook(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  const email = input.value;

  btn.textContent = '...SIGNING';
  btn.style.background = 'var(--purple)';
  btn.style.color = 'var(--white)';

  setTimeout(() => {
    btn.textContent = 'SIGNED ✓';
    input.value = '';

    // Store locally
    const list = JSON.parse(localStorage.getItem('mj-guestbook') || '[]');
    list.push({ email, date: new Date().toISOString() });
    localStorage.setItem('mj-guestbook', JSON.stringify(list));

    setTimeout(() => {
      btn.textContent = 'SIGN';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }, 800);
}

// --- MERCH PAGE FUNCTIONS ---

let orderItems = [];

function handleMerchOrder(item, btn) {
  // Get size if applicable
  const card = btn.closest('.merch-full-card');
  const sizeSelect = card ? card.querySelector('.size-select select') : null;
  const size = sizeSelect ? sizeSelect.value : null;

  const itemString = size ? `${item} (${size})` : item;
  orderItems.push(itemString);

  // Update the order form textarea
  const textarea = document.getElementById('order-items');
  if (textarea) {
    textarea.value = orderItems.join(', ');
  }

  // Button feedback
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '&#10003; ADDED';
  btn.style.background = 'var(--purple)';
  btn.style.color = 'var(--white)';

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);

  // Scroll to order form on 2nd+ add
  if (orderItems.length > 1) {
    const formSection = document.getElementById('order-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

function handleMerchSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const subject = encodeURIComponent('Merch Order from ' + data.get('name'));
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\n` +
    `Email: ${data.get('email')}\n` +
    `Address: ${data.get('address')}\n` +
    `Items: ${data.get('items')}\n` +
    `Notes: ${data.get('notes')}`
  );

  const btn = form.querySelector('.submit-btn');
  btn.innerHTML = '&#10003; ORDER SUBMITTED';
  btn.style.background = 'var(--purple)';
  btn.style.color = 'var(--white)';

  window.location.href = `mailto:motherjohnsonband@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    btn.innerHTML = '&#9654; Submit Order';
    btn.style.background = '';
    btn.style.color = '';
    form.reset();
    orderItems = [];
  }, 3000);
}

// --- KONAMI CODE EASTER EGG ---
(function konamiCode() {
  const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
  let index = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === code[index]) {
      index++;
      if (index === code.length) {
        // Activate CRT mode
        document.body.style.animation = 'flicker 0.5s infinite';
        document.querySelectorAll('.section-title').forEach(el => {
          el.style.animation = 'glitch 0.3s infinite, glitch-color 0.5s infinite';
        });
        setTimeout(() => {
          document.body.style.animation = '';
          document.querySelectorAll('.section-title').forEach(el => {
            el.style.animation = '';
          });
        }, 5000);
        index = 0;
      }
    } else {
      index = 0;
    }
  });
})();

// --- RANDOM GLITCH ON TITLES (occasional) ---
(function randomGlitch() {
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  setInterval(() => {
    const title = titles[Math.floor(Math.random() * titles.length)];
    title.style.animation = 'glitch 0.15s ease';
    setTimeout(() => {
      title.style.animation = '';
    }, 150);
  }, 8000);
})();
