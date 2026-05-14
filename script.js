/* ============================================
   Club Zenith — Main JavaScript
   Galaxy particles, typing effect, scroll
   animations, and interactive effects.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========  GALAXY PARTICLE CANVAS  ========== */
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse for subtle parallax on stars
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Star class
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.3;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.speed = Math.random() * 0.3 + 0.05;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir = 1;
      // Gold-tinted or white
      this.isGold = Math.random() < 0.15;
    }
    update() {
      // Gentle drift downward
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = -5;
        this.x = Math.random() * canvas.width;
      }
      // Twinkle
      this.opacity += this.twinkleSpeed * this.twinkleDir;
      if (this.opacity >= 1) this.twinkleDir = -1;
      if (this.opacity <= 0.1) this.twinkleDir = 1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.isGold) {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      }
      ctx.fill();
      // Add glow for larger stars
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        const alpha = this.opacity * 0.1;
        ctx.fillStyle = this.isGold
          ? `rgba(255, 215, 0, ${alpha})`
          : `rgba(200, 200, 255, ${alpha})`;
        ctx.fill();
      }
    }
  }

  // Shooting star class
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width * 0.8;
      this.y = Math.random() * canvas.height * 0.3;
      this.len = Math.random() * 120 + 60;
      this.speed = Math.random() * 8 + 4;
      this.opacity = 1;
      this.active = false;
      this.angle = (Math.random() * 30 + 15) * (Math.PI / 180);
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.012;
      if (this.opacity <= 0) {
        this.active = false;
        this.reset();
      }
    }
    draw() {
      if (!this.active) return;
      const tailX = this.x - Math.cos(this.angle) * this.len;
      const tailY = this.y - Math.sin(this.angle) * this.len;
      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, `rgba(255, 215, 0, 0)`);
      grad.addColorStop(1, `rgba(255, 215, 0, ${this.opacity})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Initialize stars
  const starCount = Math.min(Math.floor(window.innerWidth * 0.15), 250);
  for (let i = 0; i < starCount; i++) stars.push(new Star());

  // Initialize shooting stars pool
  for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

  // Periodically trigger a shooting star
  setInterval(() => {
    const inactive = shootingStars.find(s => !s.active);
    if (inactive) {
      inactive.reset();
      inactive.active = true;
    }
  }, 4000);

  // Animation loop
  function animateGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    shootingStars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateGalaxy);
  }
  animateGalaxy();

  /* ==========  TYPING EFFECT  ========== */
  const taglineEl = document.getElementById('tagline');
  const phrases = [
    'Innovate. Build. Lead the Future.',
    'Beyond Peaks. Together.',
    'Where Ideas Ignite.',
    'Code. Create. Conquer.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  // Add cursor element
  const cursorSpan = document.createElement('span');
  cursorSpan.classList.add('cursor');
  taglineEl.appendChild(cursorSpan);

  function typeEffect() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      taglineEl.textContent = current.substring(0, charIdx + 1);
      taglineEl.appendChild(cursorSpan);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000); // Pause before deleting
        return;
      }
      setTimeout(typeEffect, 80);
    } else {
      taglineEl.textContent = current.substring(0, charIdx - 1);
      taglineEl.appendChild(cursorSpan);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeEffect, 500);
        return;
      }
      setTimeout(typeEffect, 40);
    }
  }
  // Start typing after hero fades in
  setTimeout(typeEffect, 1200);

  /* ==========  NAVBAR SCROLL EFFECT  ========== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========  MOBILE HAMBURGER MENU  ========== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ==========  SCROLL REVEAL ANIMATION  ========== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation for siblings
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Assign stagger delays based on sibling position
  const grids = document.querySelectorAll('.vm-grid, .wwd-grid, .why-grid, .team-grid');
  grids.forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.dataset.delay = i * 120;
    });
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========  CARD GLOW ON MOUSE MOVE  ========== */
  const glowCards = document.querySelectorAll('.vm-card, .wwd-card, .why-card, .team-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(255,215,0,0.06), transparent 60%), rgba(15,15,45,0.6)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ==========  SMOOTH SCROLL FOR ANCHOR LINKS  ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 70; // Account for navbar
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ==========  ACTIVE NAV LINK HIGHLIGHT  ========== */
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#FFD700';
      }
    });
  });

});
