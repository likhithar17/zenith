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
        ctx.fillStyle = `rgba(221, 240, 255, ${this.opacity})`;
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
          ? `rgba(221, 240, 255, ${alpha})`
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
      grad.addColorStop(0, `rgba(221, 240, 255, 0)`);
      grad.addColorStop(1, `rgba(221, 240, 255, ${this.opacity})`);
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
      card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(221,240,255,0.06), transparent 60%), rgba(15,15,45,0.6)`;
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
        link.style.color = '#DDF0FF';
      }
    });
  });

  /* ==========  TEAM CARD SOCIAL LINKS  ========== */
  const linkedinSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  const githubSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';

  // Social data — replace '#' with actual profile URLs
  const teamSocials = {
    'Nishanth. S':    { linkedin: '#', github: '#' },
    'Sanchitha':      { linkedin: '#', github: '#' },
    'Vineeth. J':        { linkedin: 'https://www.linkedin.com/in/vineeth-jagadeesh-140674387?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/vineeth-ctrl' },
    'Kripa':          { linkedin: 'https://www.linkedin.com/in/kripa-singh-524175385/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BflU9sb0hTHuH4k0NHjzOQw%3D%3D', github: 'https://github.com/kripasingh18' },
    'Sai Satvik N Urs':        { linkedin: '#', github: '#' },
    'Likhitha ':        { linkedin: 'https://www.linkedin.com/in/likhitha-r-258432383', github: 'https://github.com/likhithar17' },
    'Shree Lakshmi':  { linkedin: '#', github: '#' },
    'Suhas':          { linkedin: '#', github: '#' },
    'Dhruvitha':      { linkedin: '#', github: '#' },
    'Varshitha Shetty':{ linkedin: '#', github: '#' },
    'Thanya M':       { linkedin: '#', github: '#' },
    'Yashwanth Ganesh':{ linkedin: '#', github: '#' },
    'Shilpa':         { linkedin: '#', github: '#' },
    'Mohith Ashwin':  { linkedin: '#', github: '#' },
    'Ninaad':         { linkedin: '#', github: '#' },
    'Sai Gagan':      { linkedin: '#', github: '#' },
    'Prajwal Gowda':  { linkedin: '#', github: '#' },
    'Rohan Anil':     { linkedin: '#', github: '#' },
    'Appu':           { linkedin: '#', github: '#' },
    'Poorvika':       { linkedin: '#', github: '#' },
    'Thejaswi':       { linkedin: '#', github: '#' },
  };

  document.querySelectorAll('.team-card').forEach(card => {
    const name = card.querySelector('h4')?.textContent.trim();
    const socials = teamSocials[name] || { linkedin: '#', github: '#' };

    // Create overlay
    const overlay = document.createElement('div');
    overlay.classList.add('team-social-overlay');
    overlay.innerHTML = `
      <a href="${socials.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">${linkedinSVG}</a>
      <a href="${socials.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">${githubSVG}</a>
    `;
    card.appendChild(overlay);

    // Toggle on card click
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking a social link
      if (e.target.closest('a')) return;
      card.classList.toggle('show-socials');
    });
  });

  // Close overlay when clicking outside any card
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.team-card')) {
      document.querySelectorAll('.team-card.show-socials').forEach(c => c.classList.remove('show-socials'));
    }
  });

  /* ==========  SEE OTHER MEMBERS TOGGLE  ========== */
  const seeMoreBtn = document.getElementById('seeMoreBtn');
  const otherMembersGrid = document.getElementById('otherMembersGrid');

  if (seeMoreBtn && otherMembersGrid) {
    seeMoreBtn.addEventListener('click', () => {
      if (otherMembersGrid.style.display === 'none') {
        otherMembersGrid.style.display = 'grid';
        seeMoreBtn.textContent = 'Hide Other Members';
        
        // Trigger reveal animations for the newly shown members
        setTimeout(() => {
          otherMembersGrid.querySelectorAll('.reveal').forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('active');
            }, index * 100);
          });
        }, 50);

      } else {
        otherMembersGrid.style.display = 'none';
        seeMoreBtn.textContent = 'See Other Members';
        
        // Reset animations so they play again when opened
        otherMembersGrid.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('active');
        });
      }
    });
  }

});
