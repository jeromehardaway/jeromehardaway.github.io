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
    
    // Dispatch theme change event
    const event = new CustomEvent('data-theme-changed', { detail: { theme: 'dark' } });
    document.documentElement.dispatchEvent(event);
  }

  enableLightMode(animate = true) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(this.darkModeKey, 'light');
    
    // Dispatch theme change event
    const event = new CustomEvent('data-theme-changed', { detail: { theme: 'light' } });
    document.documentElement.dispatchEvent(event);
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
    const skillsAnimationManager = new SkillsAnimationManager();
    const projectAnimationManager = new ProjectAnimationManager();
    
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

// Skills Animation with Anime.js
class SkillsAnimationManager {
  constructor() {
    this.tooltip = document.getElementById('tooltip');
    this.tools = document.querySelectorAll('.tool');
    this.modal = document.getElementById('skillModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.closeModalBtn = document.getElementById('closeModal');
    this.modalBackdrop = document.querySelector('.modal-backdrop');
    
    this.init();
  }

  init() {
    this.setupTooltip();
    this.setupModal();
    this.animateSkills();
    this.setupObserver();
  }

  setupTooltip() {
    if (!this.tooltip || this.tools.length === 0) return;

    // Keep tooltip functionality for devices that support hover
    // (mostly for desktop, as an enhancement)
    if (window.matchMedia('(hover: hover)').matches) {
      this.tools.forEach(tool => {
        tool.addEventListener('mouseenter', (e) => {
          this.tooltip.innerText = tool.dataset.description;
          this.tooltip.style.display = 'block';
          this.tooltip.style.opacity = '1';
          this.updateTooltipPosition(e);
        });

        tool.addEventListener('mousemove', (e) => {
          this.updateTooltipPosition(e);
        });

        tool.addEventListener('mouseleave', () => {
          this.tooltip.style.opacity = '0';
          setTimeout(() => {
            this.tooltip.style.display = 'none';
          }, 200);
        });
      });
    }
  }

  setupModal() {
    if (!this.modal || this.tools.length === 0) return;
    
    // Setup click events for all skill tools
    this.tools.forEach(tool => {
      tool.addEventListener('click', () => {
        const skillName = tool.textContent;
        const skillDescription = tool.dataset.description;
        
        this.openModal(skillName, skillDescription);
      });
    });
    
    // Setup close modal functionality
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    // Close modal when clicking on backdrop
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
  
  openModal(title, description) {
    if (!this.modal) return;
    
    this.modalTitle.textContent = title;
    this.modalDescription.textContent = description;
    
    // Show the modal
    this.modal.classList.add('active');
    
    // Add animation with anime.js if available
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.modal-container',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    if (!this.modal) return;
    
    // Add animation with anime.js if available
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.modal-container',
        scale: [1, 0.9],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInCubic',
        complete: () => {
          this.modal.classList.remove('active');
        }
      });
    } else {
      // Fallback without animation
      this.modal.classList.remove('active');
    }
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }

  updateTooltipPosition(e) {
    const windowWidth = window.innerWidth;
    const tooltipWidth = this.tooltip.offsetWidth;
    const tooltipHeight = this.tooltip.offsetHeight;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Check if tooltip would go off screen to the right
    if (e.pageX + tooltipWidth + 15 > windowWidth) {
      this.tooltip.style.left = `${e.pageX - tooltipWidth - 10}px`;
    } else {
      this.tooltip.style.left = `${e.pageX + 15}px`;
    }
    
    // Check if tooltip would go off screen at the bottom
    if (e.pageY - scrollY + tooltipHeight + 10 > viewportHeight) {
      this.tooltip.style.top = `${e.pageY - tooltipHeight - 10}px`;
    } else {
      this.tooltip.style.top = `${e.pageY + 10}px`;
    }
  }

  animateSkills() {
    // Only run animation if anime.js is loaded
    if (typeof anime === 'undefined') return;
    
    anime({
      targets: '.skills-section .tool',
      opacity: [0, 1],
      translateY: [-15, 0],
      scale: [0.95, 1],
      delay: anime.stagger(30, {grid: [3, 5], from: 'center'}),
      duration: 700,
      easing: 'easeOutExpo',
      autoplay: false
    });
    
    anime({
      targets: '.skills-section .vertical',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(150),
      duration: 1000,
      easing: 'easeOutQuint',
      autoplay: false
    });
  }

  setupObserver() {
    const skillSection = document.querySelector('#skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.playAnimations();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(skillSection);
  }

  playAnimations() {
    if (typeof anime === 'undefined') return;
    
    // First animate all vertical sections together
    anime({
      targets: '.skills-section .vertical',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: function(el, i) { return i * 150; }, // Sequential delay based on index
      duration: 800,
      easing: 'easeOutQuint',
    }).finished.then(() => {
      // Then animate all tool elements
      anime({
        targets: '.skills-section .tool',
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: anime.stagger(40),
        duration: 600,
        easing: 'easeOutExpo'
      });
    });
  }
}

// ProjectAnimationManager - Handles project card animations
class ProjectAnimationManager {
  constructor() {
    this.projectsSection = document.getElementById('projects');
    this.projectCards = document.querySelectorAll('.vanta-fly-in');
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    if (this.projectCards.length > 0) {
      this.setupProjectsAnimation();
      this.setupScrollEffect();
    } else {
      console.error('Project cards not found');
    }
  }

  setupProjectsAnimation() {
    // Intersection observer for project cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = card.dataset.delay || 0;
          
          setTimeout(() => {
            card.classList.add('animate');
          }, parseInt(delay));
          
          observer.unobserve(card);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all project cards
    this.projectCards.forEach(card => {
      observer.observe(card);
      
      // Add 3D parallax effect on mouse move
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 15; // More pronounced effect
        const moveY = (y - centerY) / 15;
        
        // Apply the 3D rotation effect
        card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) translateZ(20px) scale(1.05)`;
        
        // Move the project image for a parallax effect
        const projectImage = card.querySelector('.project-image img');
        if (projectImage) {
          projectImage.style.transform = `translateX(${moveX * 2}px) translateY(${moveY * 2}px) scale(1.1)`;
        }
      });
      
      // Reset transform on mouse leave with smooth transition
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = '';
        
        const projectImage = card.querySelector('.project-image img');
        if (projectImage) {
          projectImage.style.transition = 'transform 0.5s ease-out';
          projectImage.style.transform = 'scale(1)';
        }
        
        // Remove the transition after it completes to allow smooth mouse move again
        setTimeout(() => {
          card.style.transition = '';
          if (projectImage) {
            projectImage.style.transition = '';
          }
        }, 500);
      });
    });
  }

  setupScrollEffect() {
    // Add floating animation when scrolling
    window.addEventListener('scroll', () => {
      if (this.isInView(this.projectsSection) && !this.isAnimating) {
        this.isAnimating = true;
        
        this.projectCards.forEach((card, index) => {
          // Subtle floating effect
          anime({
            targets: card,
            translateY: [
              { value: -10, duration: 1500, easing: 'easeInOutQuad' },
              { value: 0, duration: 1500, easing: 'easeInOutQuad' }
            ],
            delay: index * 100,
            loop: true,
            direction: 'alternate'
          });
        });
      } else if (!this.isInView(this.projectsSection) && this.isAnimating) {
        this.isAnimating = false;
        anime.remove(this.projectCards);
      }
    });
  }

  isInView(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
}