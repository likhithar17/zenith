
/* ============================================
   Club Zenith — Interactions and Galaxy Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. GALAXY BACKGROUND AND SHOOTING STARS
  // ==========================================

  const canvas = document.getElementById('galaxy-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
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
        this.isGold = Math.random() < 0.15;
      }

      update() {
        this.y += this.speed;

        if (this.y > canvas.height) {
          this.y = -5;
          this.x = Math.random() * canvas.width;
        }

        this.opacity += this.twinkleSpeed * this.twinkleDir;

        if (this.opacity >= 1) {
          this.twinkleDir = -1;
        }

        if (this.opacity <= 0.1) {
          this.twinkleDir = 1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${
          this.isGold ? '221,240,255' : '255,255,255'
        },${this.opacity})`;

        ctx.fill();

        if (this.size > 1.2) {
          ctx.beginPath();
          ctx.arc(
            this.x,
            this.y,
            this.size * 3,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            `rgba(200,200,255,${this.opacity * 0.1})`;

          ctx.fill();
        }
      }
    }

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
        this.angle =
          (Math.random() * 30 + 15) * Math.PI / 180;
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

        const tx =
          this.x - Math.cos(this.angle) * this.len;

        const ty =
          this.y - Math.sin(this.angle) * this.len;

        const gradient = ctx.createLinearGradient(
          tx,
          ty,
          this.x,
          this.y
        );

        gradient.addColorStop(
          0,
          'rgba(221,240,255,0)'
        );

        gradient.addColorStop(
          1,
          `rgba(221,240,255,${this.opacity})`
        );

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(this.x, this.y);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = Math.min(
        Math.floor(window.innerWidth * 0.15),
        250
      );

      while (stars.length < count) {
        stars.push(new Star());
      }

      stars.length = Math.min(stars.length, count);
    }

    for (
      let i = 0;
      i < Math.min(Math.floor(window.innerWidth * 0.15), 250);
      i++
    ) {
      stars.push(new Star());
    }

    for (let i = 0; i < 3; i++) {
      shootingStars.push(new ShootingStar());
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    setInterval(() => {
      const star = shootingStars.find(
        shootingStar => !shootingStar.active
      );

      if (star) {
        star.reset();
        star.active = true;
      }
    }, 4000);

    function animateGalaxy() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });

      requestAnimationFrame(animateGalaxy);
    }

    animateGalaxy();
  }


  // ==========================================
  // 2. TYPING TAGLINE EFFECT
  // ==========================================

  const tagline = document.getElementById('tagline');

  if (tagline) {
    const phrases = [
      'Innovate. Build. Lead the Future.',
      'Beyond Peaks. Together.',
      'Where Ideas Ignite.',
      'Code. Create. Conquer.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    tagline.appendChild(cursor);

    function type() {
      const currentPhrase = phrases[phraseIndex];

      charIndex += deleting ? -1 : 1;

      tagline.textContent =
        currentPhrase.substring(0, charIndex);

      tagline.appendChild(cursor);

      if (
        !deleting &&
        charIndex === currentPhrase.length
      ) {
        deleting = true;
        setTimeout(type, 2000);
      } else if (deleting && charIndex === 0) {
        deleting = false;

        phraseIndex =
          (phraseIndex + 1) % phrases.length;

        setTimeout(type, 500);
      } else {
        setTimeout(type, deleting ? 40 : 80);
      }
    }

    setTimeout(type, 1200);
  }


  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================

  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle(
        'scrolled',
        window.scrollY > 60
      );
    });
  }


  // ==========================================
  // 4. MOBILE HAMBURGER MENU
  // ==========================================

  const hamburger =
    document.getElementById('hamburger');

  const navLinks =
    document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen =
        hamburger.classList.toggle('active');

      navLinks.classList.toggle('active');

      hamburger.setAttribute(
        'aria-expanded',
        String(isOpen)
      );
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');

        hamburger.setAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  }


  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, Number(entry.target.dataset.delay || 0));

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  document
    .querySelectorAll(
      '.vm-grid, .wwd-grid, .why-grid, .team-grid'
    )
    .forEach(grid => {
      grid.querySelectorAll('.reveal').forEach(
        (element, index) => {
          element.dataset.delay = index * 120;
        }
      );
    });

  document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
  });


  // ==========================================
  // 6. CARD GLOW EFFECT
  // ==========================================

  document
    .querySelectorAll(
      '.vm-card, .wwd-card, .why-card, .team-card'
    )
    .forEach(card => {

      card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);

        card.style.background = `
          radial-gradient(
            300px circle at ${x}px ${y}px,
            rgba(221,240,255,0.06),
            transparent 60%
          ),
          rgba(15,15,45,0.6)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });


  // ==========================================
  // 7. SMOOTH IN-PAGE NAVIGATION
  // ==========================================

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener('click', event => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (target) {
          event.preventDefault();

          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      });
    });


  // ==========================================
  // 8. ACTIVE NAVIGATION LINK
  // ==========================================

  const sections =
    document.querySelectorAll('section');

  const navItems =
    document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      if (
        window.scrollY >= section.offsetTop - 120
      ) {
        currentSection = section.id;
      }
    });

    navItems.forEach(link => {
      link.style.color =
        link.getAttribute('href') === `#${currentSection}`
          ? '#DDF0FF'
          : '';
    });
  });


  // ==========================================
  // 9. TEAM MEMBER SOCIAL OVERLAYS
  // ==========================================

  const linkedinSVG = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569
      c0-1.328-.027-3.037-1.852-3.037
      -1.853 0-2.136 1.445-2.136 2.939v5.667
      H9.351V9h3.414v1.561h.046
      c.477-.9 1.637-1.85 3.37-1.85
      3.601 0 4.267 2.37 4.267 5.455v6.286z
      M5.337 7.433a2.062 2.062 0 01-2.063-2.065
      2.064 2.064 0 112.063 2.065z
      M7.119 20.452H3.555V9h3.564v11.452z
      M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542
      C0 23.227.792 24 1.771 24h20.451
      C23.2 24 24 23.227 24 22.271V1.729
      C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  `;

  const githubSVG = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12
      0 5.303 3.438 9.8 8.205 11.385
      .6.113.82-.258.82-.577
      0-.285-.01-1.04-.015-2.04
      -3.338.724-4.042-1.61-4.042-1.61
      C4.422 18.07 3.633 17.7 3.633 17.7
      c-1.087-.744.084-.729.084-.729
      1.205.084 1.838 1.236 1.838 1.236
      1.07 1.835 2.809 1.305 3.495.998
      .108-.776.417-1.305.76-1.605
      -2.665-.3-5.466-1.332-5.466-5.93
      0-1.31.465-2.38 1.235-3.22
      .135-.303-.54-1.523.105-3.176
      0 0 1.005-.322 3.3 1.23
      .96-.267 1.98-.399 3-.405
      1.02.006 2.04.138 3.285-1.23
      0 0 .645 2.873.12 3.176
      .765.84 1.23 1.91 1.23 3.22
      0 4.61-2.805 5.625-5.475 5.92
      .42.36.81 1.096.81 2.22
      0 1.606.21.69.825.57
      C20.565 22.092 24 17.592 24 12.297
      c0-6.627-5.373-12-12-12"/>
    </svg>
  `;

  document.querySelectorAll('.team-card').forEach(card => {
    const overlay = document.createElement('div');

    overlay.className = 'team-social-overlay';

    overlay.innerHTML = `
      <a href="#"
         aria-label="LinkedIn"
         title="Add LinkedIn profile">
        ${linkedinSVG}
      </a>

      <a href="#"
         aria-label="GitHub"
         title="Add GitHub profile">
        ${githubSVG}
      </a>
    `;

    card.appendChild(overlay);

    card.addEventListener('click', event => {
      if (!event.target.closest('a')) {
        card.classList.toggle('show-socials');
      }
    });
  });

  // Close team social overlays when clicking outside
  document.addEventListener('click', event => {
    if (!event.target.closest('.team-card')) {
      document
        .querySelectorAll('.team-card.show-socials')
        .forEach(card => {
          card.classList.remove('show-socials');
        });
    }
  });


  // ==========================================
  // 10. SEE OTHER MEMBERS BUTTON
  // ==========================================

  const seeMoreBtn =
    document.getElementById('seeMoreBtn');

  const otherGrid =
    document.getElementById('otherMembersGrid');

  if (seeMoreBtn && otherGrid) {
    seeMoreBtn.addEventListener('click', () => {

      const shouldShow =
        window.getComputedStyle(otherGrid).display === 'none';

      otherGrid.style.display =
        shouldShow ? 'grid' : 'none';

      seeMoreBtn.textContent =
        shouldShow
          ? 'Hide Other Members'
          : 'See Other Members';

      seeMoreBtn.setAttribute(
        'aria-expanded',
        String(shouldShow)
      );

      if (shouldShow) {
        setTimeout(() => {
          otherGrid
            .querySelectorAll('.reveal')
            .forEach((element, index) => {
              setTimeout(() => {
                element.classList.add('active');
              }, index * 100);
            });
        }, 50);

      } else {
        otherGrid
          .querySelectorAll('.reveal')
          .forEach(element => {
            element.classList.remove('active');
          });
      }
    });
  }

});
