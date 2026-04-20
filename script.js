/* ================================================
   AGNES ANNA AJO — Portfolio JavaScript
   Theme: Dark Genomics / Bioinformatics Aesthetic
   ================================================ */

/* ════════════════════════════════════════
   1. CUSTOM CURSOR
════════════════════════════════════════ */

const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

// Move cursor dot and ring with mouse
document.addEventListener('mousemove', (e) => {
  // Dot follows instantly
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  cursor.style.transform = 'translate(-50%, -50%)';

  // Ring follows with a slight delay
  setTimeout(() => {
    cursorRing.style.left      = e.clientX + 'px';
    cursorRing.style.top       = e.clientY + 'px';
    cursorRing.style.transform = 'translate(-50%, -50%)';
  }, 80);
});

// Expand ring on interactive elements
const interactiveEls = document.querySelectorAll(
  'a, button, .exp-card, .seq-card, .soft-pill'
);

interactiveEls.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width   = '52px';
    cursorRing.style.height  = '52px';
    cursorRing.style.opacity = '0.8';
  });

  el.addEventListener('mouseleave', () => {
    cursorRing.style.width   = '36px';
    cursorRing.style.height  = '36px';
    cursorRing.style.opacity = '0.5';
  });
});


/* ════════════════════════════════════════
   2. MOUSE PARTICLE TRAIL
════════════════════════════════════════ */

let lastParticleTime = 0;

/**
 * Creates a small glowing dot at (x, y) that fades and floats away.
 * @param {number} x - clientX position
 * @param {number} y - clientY position
 */
function spawnParticle(x, y) {
  const particle = document.createElement('div');

  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(0, 229, 192, 0.6);
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%, -50%);
    transition: opacity 0.6s ease, transform 0.6s ease;
  `;

  document.body.appendChild(particle);

  // Trigger the fade + drift animation on next frame
  setTimeout(() => {
    const driftX = (Math.random() - 0.5) * 30;
    const driftY = (Math.random() - 0.5) * 30;
    particle.style.opacity   = '0';
    particle.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0)`;
  }, 10);

  // Remove from DOM after animation
  setTimeout(() => particle.remove(), 620);
}

// Throttle: spawn a particle every 60ms max
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastParticleTime > 60) {
    spawnParticle(e.clientX, e.clientY);
    lastParticleTime = now;
  }
});


/* ════════════════════════════════════════
   3. SCROLL REVEAL (Intersection Observer)
════════════════════════════════════════ */

const revealElements = document.querySelectorAll('.reveal');

/**
 * Adds the 'visible' class when an element enters the viewport,
 * triggering its CSS opacity + translateY transition.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* ════════════════════════════════════════
   4. SKILL BAR ANIMATION (Intersection Observer)
════════════════════════════════════════ */

const skillBarFills = document.querySelectorAll('.skill-bar-fill');

/**
 * When a skill bar scrolls into view, read its data-width attribute
 * and animate the bar fill from 0 to that percentage.
 */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill      = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width  = targetWidth + '%';
        skillBarObserver.unobserve(fill); // animate once only
      }
    });
  },
  { threshold: 0.3 }
);

skillBarFills.forEach((bar) => skillBarObserver.observe(bar));


/* ════════════════════════════════════════
   5. SMOOTH SCROLL (Anchor Links)
════════════════════════════════════════ */

/**
 * Intercepts all internal anchor clicks (#section) and
 * uses scrollIntoView for a smooth, native scroll.
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetSelector = this.getAttribute('href');
    const target = document.querySelector(targetSelector);

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ════════════════════════════════════════
   6. NAVBAR — Active Link Highlight on Scroll
════════════════════════════════════════ */

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

/**
 * Watches which section is in the viewport and highlights
 * the matching nav link with the accent colour.
 */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--accent1)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((sec) => navObserver.observe(sec));


/* ════════════════════════════════════════
   7. NAVBAR — Hide / Show on Scroll Direction
════════════════════════════════════════ */

let lastScrollY   = window.scrollY;
const navEl       = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    // Scrolling DOWN — hide nav
    navEl.style.transform  = 'translateY(-100%)';
    navEl.style.transition = 'transform 0.35s ease';
  } else {
    // Scrolling UP — show nav
    navEl.style.transform  = 'translateY(0)';
    navEl.style.transition = 'transform 0.35s ease';
  }

  lastScrollY = currentScrollY;
});


/* ════════════════════════════════════════
   8. TYPING EFFECT — Hero Subtitle
════════════════════════════════════════ */

const heroTitle = document.querySelector('.hero-title');

if (heroTitle) {
  const fullText    = heroTitle.textContent.trim();
  const typingDelay = 1200;   // ms before typing starts
  const charSpeed   = 38;     // ms per character

  heroTitle.textContent = '';
  heroTitle.style.borderRight = '2px solid var(--accent2)'; // caret

  let charIndex = 0;

  /**
   * Types one character at a time into .hero-title.
   */
  function typeNextChar() {
    if (charIndex < fullText.length) {
      heroTitle.textContent += fullText[charIndex];
      charIndex++;
      setTimeout(typeNextChar, charSpeed);
    } else {
      // Remove blinking caret after typing finishes
      setTimeout(() => {
        heroTitle.style.borderRight = 'none';
      }, 800);
    }
  }

  setTimeout(typeNextChar, typingDelay);
}


/* ════════════════════════════════════════
   9. SOFT SKILL PILLS — Staggered Entrance
════════════════════════════════════════ */

const softPills     = document.querySelectorAll('.soft-pill');
const pillContainer = document.querySelector('.soft-skills-grid');

if (pillContainer) {
  // Hide all pills initially
  softPills.forEach((pill) => {
    pill.style.opacity   = '0';
    pill.style.transform = 'translateY(12px)';
    pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  /**
   * When the pill container scrolls into view,
   * reveal each pill with a staggered delay.
   */
  const pillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          softPills.forEach((pill, i) => {
            setTimeout(() => {
              pill.style.opacity   = '1';
              pill.style.transform = 'translateY(0)';
            }, i * 80);
          });
          pillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  pillObserver.observe(pillContainer);
}


/* ════════════════════════════════════════
   10. EXPERTISE CARDS — Tilt on Mouse Move
════════════════════════════════════════ */

const expCards = document.querySelectorAll('.exp-card');

expCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;

    // Max tilt ±6 degrees
    const tiltX  = ((y - cy) / cy) * 6;
    const tiltY  = ((x - cx) / cx) * -6;

    card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.4s ease';
  });
});


/* ════════════════════════════════════════
   11. PAGE LOAD — Progress Bar
════════════════════════════════════════ */

/**
 * Shows a thin teal progress bar at the very top of the page
 * that fills from 0 → 100% as the user scrolls.
 */
const progressBar = document.createElement('div');

progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--accent1), var(--accent2));
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;

document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});


/* ════════════════════════════════════════
   12. SEQUENCE CARDS — Glint Effect on Hover
════════════════════════════════════════ */

const seqCards = document.querySelectorAll('.seq-card');

seqCards.forEach((card) => {
  // Create a glint overlay element
  const glint = document.createElement('div');
  glint.style.cssText = `
    position: absolute;
    top: 0; left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(0, 229, 192, 0.08) 50%,
      transparent 100%
    );
    pointer-events: none;
    transition: left 0.5s ease;
  `;

  card.style.position = 'relative';
  card.style.overflow = 'hidden';
  card.appendChild(glint);

  card.addEventListener('mouseenter', () => {
    glint.style.left = '125%';
  });

  card.addEventListener('mouseleave', () => {
    glint.style.transition = 'none';
    glint.style.left       = '-75%';
    // Re-enable transition after reset
    setTimeout(() => {
      glint.style.transition = 'left 0.5s ease';
    }, 10);
  });
});


/* ════════════════════════════════════════
   13. CONTACT EMAIL — COPY TO CLIPBOARD
════════════════════════════════════════ */

const emailLink = document.querySelector('.contact-email');

if (emailLink) {
  emailLink.setAttribute('title', 'Click to copy email');

  emailLink.addEventListener('click', (e) => {
    e.preventDefault();

    const email = emailLink.textContent.trim();

    navigator.clipboard.writeText(email).then(() => {
      // Briefly show "Copied!" feedback
      const original         = emailLink.textContent;
      emailLink.textContent  = '✓ Copied to clipboard!';
      emailLink.style.color  = 'var(--accent1)';

      setTimeout(() => {
        emailLink.textContent = original;
        emailLink.style.color = '';
      }, 2000);
    }).catch(() => {
      // Fallback: open mail client
      window.location.href = `mailto:${email}`;
    });
  });
}


/* ════════════════════════════════════════
   14. INITIALISATION LOG
════════════════════════════════════════ */

console.log(`
%c🧬 Agnes Anna Ajo — Portfolio Loaded
%cGenomics · Sequencing Technologies · Bioinformatics · Data Handling · Statistics

All modules initialised:
  ✓ Custom Cursor
  ✓ Particle Trail
  ✓ Scroll Reveal
  ✓ Skill Bar Animation
  ✓ Smooth Scroll
  ✓ Active Nav Highlight
  ✓ Nav Hide/Show on Scroll
  ✓ Typing Effect
  ✓ Staggered Pill Entrance
  ✓ Card Tilt Effect
  ✓ Scroll Progress Bar
  ✓ Sequence Card Glint
  ✓ Copy Email to Clipboard
`,
'color: #00e5c0; font-size: 14px; font-weight: bold;',
'color: #6a8fa8; font-size: 11px;'
);
