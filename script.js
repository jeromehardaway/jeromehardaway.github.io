// =================================================================
// JEROME HARDAWAY - SENIOR AI ENGINEER PORTFOLIO
// Neural Architecture Interactive Effects
// =================================================================

// =================================================================
// NEURAL NETWORK BACKGROUND ANIMATION
// =================================================================
function createNeuralNetwork() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.15';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0066cc';  // Patriotic blue
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 102, 204, ${1 - distance / 150})`;  // Patriotic blue
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();

  // Cleanup on page unload
  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}

// =================================================================
// SCROLL ANIMATIONS - INTERSECTION OBSERVER
// =================================================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections and skill cards
  const elementsToAnimate = document.querySelectorAll(
    '.about-section, .skills-section, .skill-category, .expertise-item, .stat-item'
  );

  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// =================================================================
// STAT COUNTER ANIMATION
// =================================================================
function animateStats() {
  const stats = document.querySelectorAll('.stat-value');

  stats.forEach(stat => {
    const target = stat.textContent;
    const isNumber = target.match(/\d+/);

    if (!isNumber) return;

    const number = parseInt(isNumber[0]);
    const suffix = target.replace(/\d+/, '');
    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    let current = 0;
    let stepCount = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = setInterval(() => {
            current += stepValue;
            stepCount++;

            if (stepCount >= steps) {
              current = number;
              clearInterval(counter);
            }

            stat.textContent = Math.floor(current) + suffix;
          }, duration / steps);

          observer.unobserve(stat);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(stat);
  });
}

// =================================================================
// TYPING EFFECT FOR HERO TITLE
// =================================================================
function typewriterEffect() {
  const titleElement = document.querySelector('.hero-title');
  if (!titleElement) return;

  const text = titleElement.textContent.trim();
  titleElement.textContent = '';
  titleElement.style.opacity = '1';

  let index = 0;
  const speed = 100;

  function type() {
    if (index < text.length) {
      titleElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 500);
}

// =================================================================
// PARALLAX SCROLL EFFECT
// =================================================================
function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.hero-content');

    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
  });
}

// =================================================================
// SMOOTH SCROLL FOR NAVIGATION
// =================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        const hamburger = document.getElementById('hamburger-menu');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });
}

// =================================================================
// ACTIVE NAV LINK ON SCROLL
// =================================================================
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// =================================================================
// DARK MODE FUNCTIONALITY
// =================================================================
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (!darkModeToggle) return;

  // Toggle dark mode
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

    // Accessibility announcement
    const isDarkMode = document.body.classList.contains('dark-mode');
    const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  });

  // Check for saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Check system preference
  if (localStorage.getItem('darkMode') === null) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    }
  }

  // Listen for system changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('darkMode') === null) {
        document.body.classList.toggle('dark-mode', e.matches);
      }
    });
  }
}

// =================================================================
// MOBILE NAVIGATION
// =================================================================
function initMobileNav() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');

  if (!hamburgerMenu || !navLinks) return;

  hamburgerMenu.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = hamburgerMenu.contains(event.target) || navLinks.contains(event.target);

    if (!isClickInside && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburgerMenu.classList.remove('active');
    }
  });
}

// =================================================================
// SKILL CARD INTERACTIONS
// =================================================================
function initSkillInteractions() {
  const skillCategories = document.querySelectorAll('.skill-category');

  skillCategories.forEach((category, index) => {
    // Stagger the initial animation
    category.style.animationDelay = `${index * 0.1}s`;

    // Add tilt effect on mouse move
    category.addEventListener('mousemove', (e) => {
      const rect = category.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      category.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    category.addEventListener('mouseleave', () => {
      category.style.transform = '';
    });
  });
}

// =================================================================
// CURSOR TRAIL EFFECT (SUBTLE)
// =================================================================
function initCursorTrail() {
  if (window.innerWidth < 768) return; // Disable on mobile

  const coords = { x: 0, y: 0 };
  const circles = [];
  const numCircles = 12;

  // Create circles
  for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement('div');
    circle.style.position = 'fixed';
    circle.style.width = '4px';
    circle.style.height = '4px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'rgba(197, 32, 62, 0.3)';  // VWC Red
    circle.style.pointerEvents = 'none';
    circle.style.zIndex = '9999';
    circle.style.transition = 'opacity 0.3s';
    circle.style.opacity = '0';
    document.body.appendChild(circle);
    circles.push(circle);
  }

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
    circles.forEach(circle => circle.style.opacity = '1');
  });

  // Animate circles
  function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach((circle, index) => {
      circle.style.left = x - 2 + 'px';
      circle.style.top = y - 2 + 'px';
      circle.style.transform = `scale(${(numCircles - index) / numCircles})`;

      const nextCircle = circles[index + 1] || circles[0];
      x += (parseFloat(nextCircle.style.left) - x) * 0.3;
      y += (parseFloat(nextCircle.style.top) - y) * 0.3;
    });

    requestAnimationFrame(animateCircles);
  }

  animateCircles();
}

// =================================================================
// MAIN INITIALIZATION
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🧠 Neural Architecture Portfolio - Initializing...');

  // Initialize all features
  initDarkMode();
  initMobileNav();
  initSmoothScroll();
  initActiveNavigation();
  initScrollAnimations();
  animateStats();
  initParallax();
  initSkillInteractions();

  // Create neural network background (performance-friendly)
  if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    createNeuralNetwork();
    // initCursorTrail(); // Optional - uncomment for cursor trail
  }

  // Typing effect for hero title (optional)
  // typewriterEffect(); // Uncomment to enable

  console.log('✅ Portfolio initialized successfully');

  // Performance monitoring
  if (window.performance) {
    window.addEventListener('load', () => {
      const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      console.log(`⚡ Page loaded in ${loadTime}ms`);
    });
  }
});

// =================================================================
// CLEANUP ON PAGE UNLOAD
// =================================================================
window.addEventListener('beforeunload', () => {
  // Clean up any resources
  console.log('🔄 Cleaning up...');
});
