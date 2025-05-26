// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Theme Manager
class ThemeManager {
  constructor() {
    this.darkModeKey = 'darkMode';
    this.toggleBtn = document.getElementById('dark-mode-toggle');
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }

  init() {
    try {
      // Initialize theme based on localStorage or system preference
      const savedTheme = localStorage.getItem(this.darkModeKey);
      if (savedTheme === 'dark' || (!savedTheme && this.prefersDark.matches)) {
        this.enableDarkMode(false); // false to skip animation on initial load
      } else {
        this.enableLightMode(false);
      }

      this.setupEventListeners();
    } catch (error) {
      console.error('Theme initialization failed:', error);
    }
  }

  setupEventListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? this.enableLightMode()
          : this.enableDarkMode();
        this.animateToggleClick();
      });
    }

    // System theme change handler
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.darkModeKey)) {
        e.matches ? this.enableDarkMode() : this.enableLightMode();
      }
    });
  }

  animateToggleClick() {
    this.toggleBtn.classList.add('clicked');
    setTimeout(() => this.toggleBtn.classList.remove('clicked'), 200);
  }

  enableDarkMode(animate = true) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(this.darkModeKey, 'dark');
  }

  enableLightMode(animate = true) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(this.darkModeKey, 'light');
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.header = document.querySelector('.main-header');
    this.nav = document.getElementById('nav-links');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.hamburgerMenu = document.getElementById('hamburger-menu');
    this.sections = document.querySelectorAll('section');
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    this.setupMobileNav();
    this.setupScrollBehavior();
    this.setupActiveNavLinks();
    this.setupSmoothScrolling();
  }

  setupMobileNav() {
    if (this.hamburgerMenu) {
      this.hamburgerMenu.addEventListener('click', () => {
        this.toggleMobileNav();
      });

      // Close mobile nav when clicking on a link
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            this.toggleMobileNav();
          }
        });
      });
    }
  }

  toggleMobileNav() {
    this.nav.classList.toggle('active');
    this.hamburgerMenu.classList.toggle('active');
  }

  setupScrollBehavior() {
    window.addEventListener('scroll', debounce(() => {
      this.handleScroll();
      this.updateActiveNavLink();
    }, 10));
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Hide/show header on scroll
    if (currentScroll > this.lastScroll && currentScroll > 100) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScroll = currentScroll;
  }

  setupActiveNavLinks() {
    // Set initial active state
    this.updateActiveNavLink();
    
    // Update active state on scroll
    window.addEventListener('scroll', debounce(() => {
      this.updateActiveNavLink();
    }, 100));
  }

  updateActiveNavLink() {
    const scrollPosition = window.scrollY + 300;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          history.pushState(null, null, targetId);
        }
      });
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.animatedElements = document.querySelectorAll('section, .hero-image, .project-card, .expertise-card');
    this.observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      this.animatedElements.forEach(el => {
        el.classList.add('animate-in');
      });
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
}

// Form Validation and Submission
class FormManager {
  constructor() {
    this.form = document.querySelector('.contact-form');
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        this.submitForm();
      }
    });
  }

  validateForm() {
    let isValid = true;
    const name = this.form.querySelector('#name');
    const email = this.form.querySelector('#email');
    const message = this.form.querySelector('#message');
    
    // Simple validation
    if (!name.value.trim()) {
      this.showError(name, 'Name is required');
      isValid = false;
    } else {
      this.removeError(name);
    }
    
    if (!email.value.trim()) {
      this.showError(email, 'Email is required');
      isValid = false;
    } else if (!this.isValidEmail(email.value)) {
      this.showError(email, 'Please enter a valid email');
      isValid = false;
    } else {
      this.removeError(email);
    }
    
    if (!message.value.trim()) {
      this.showError(message, 'Message is required');
      isValid = false;
    } else {
      this.removeError(message);
    }
    
    return isValid;
  }

  isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.style.color = 'var(--red)';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '5px';
      errorElement.style.display = 'block';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'var(--red)';
  }

  removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      formGroup.removeChild(errorElement);
    }
    
    input.style.borderColor = '';
  }

  submitForm() {
    // Here you would typically send the data to a server
    // For demo purposes, we'll just simulate a submission
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate server request
    setTimeout(() => {
      this.form.reset();
      submitBtn.textContent = 'Message Sent!';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 3000);
    }, 1500);
  }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    const formManager = new FormManager();
    const glitchManager = new GlitchManager();
    
    // Additional initialization for any project-specific features can go here
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

// Glitch Manager for handling glitch effects
class GlitchManager {
  constructor() {
    this.heroSection = document.querySelector('.hero-section');
    this.glitchTitle = document.querySelector('.glitch-title');
    this.glitchLines = document.querySelector('.glitch-lines');
    this.glitchImages = document.querySelectorAll('.glitch-image');
    
    this.init();
  }
  
  init() {
    // Add random glitch effect to the title
    this.setupRandomGlitches();
    
    // Add mouse movement effect
    this.setupMouseEffect();
  }
  
  setupRandomGlitches() {
    // Randomly add more intense glitch to the title
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.glitchTitle.classList.add('glitch-intense');
        setTimeout(() => {
          this.glitchTitle.classList.remove('glitch-intense');
        }, 200);
      }
    }, 3000);
    
    // Randomly add flicker effect to the hero section
    setInterval(() => {
      if (Math.random() > 0.9) {
        this.heroSection.classList.add('flicker');
        setTimeout(() => {
          this.heroSection.classList.remove('flicker');
        }, 100);
      }
    }, 5000);
  }
  
  setupMouseEffect() {
    // Make glitch effect respond to mouse movement
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Adjust the image positions slightly based on mouse position
      this.glitchImages.forEach((image, index) => {
        const offsetX = (mouseX - 0.5) * (index + 1) * 5;
        const offsetY = (mouseY - 0.5) * (index + 1) * 5;
        image.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });
  }
}