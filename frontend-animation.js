/**
 * Advanced Frontend Technologies Animation
 * Uses anime.js to create an interactive 3D-like experience showcasing frontend technologies
 */

// Configuration
const techConfig = {
  html: {
    name: 'HTML5',
    color: '#e34c26',
    icon: 'fab fa-html5',
    description: 'Structure'
  },
  css: {
    name: 'CSS3',
    color: '#264de4',
    icon: 'fab fa-css3-alt',
    description: 'Style'
  },
  js: {
    name: 'JavaScript',
    color: '#f7df1e',
    icon: 'fab fa-js',
    description: 'Logic'
  },
  react: {
    name: 'React',
    color: '#61dafb',
    icon: 'fab fa-react',
    description: 'Components'
  },
  next: {
    name: 'Next.js',
    color: '#0070f3',
    icon: 'fas fa-n',
    description: 'Framework'
  }
};

// Utility functions
function createTechElement(tech, index, total) {
  const el = document.createElement('div');
  el.className = `tech-card ${tech}`;
  el.innerHTML = `
    <div class="tech-card-inner">
      <div class="tech-icon">
        <i class="${techConfig[tech].icon}" style="color: ${techConfig[tech].color}"></i>
      </div>
      <div class="tech-name" style="color: ${techConfig[tech].color}">${techConfig[tech].name}</div>
      <div class="tech-description">${techConfig[tech].description}</div>
    </div>
    <div class="tech-particles"></div>
  `;
  
  // Create particles
  const particlesContainer = el.querySelector('.tech-particles');
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = techConfig[tech].color;
    particlesContainer.appendChild(particle);
  }
  
  return el;
}

function initializeFrontendAnimation() {
  const container = document.getElementById('frontend-container');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  // Create technologies grid
  const techGrid = document.createElement('div');
  techGrid.className = 'tech-grid';
  container.appendChild(techGrid);
  
  // Add technology cards
  const technologies = Object.keys(techConfig);
  technologies.forEach((tech, index) => {
    const techEl = createTechElement(tech, index, technologies.length);
    techGrid.appendChild(techEl);
    
    // Initial animation for entry
    anime({
      targets: techEl,
      translateY: [100, 0],
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: index * 150,
      duration: 1000,
      easing: 'easeOutExpo'
    });
    
    // Animate particles
    anime({
      targets: techEl.querySelectorAll('.particle'),
      translateX: () => anime.random(-40, 40),
      translateY: () => anime.random(-40, 40),
      opacity: [0.4, 0.1],
      scale: () => anime.random(0.5, 1.5),
      delay: anime.stagger(100),
      duration: () => anime.random(1000, 3000),
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
  });
  
  // Add connection lines
  const connectionLines = document.createElement('div');
  connectionLines.className = 'connection-lines';
  techGrid.appendChild(connectionLines);
  
  // Setup interactive effects
  setupInteractiveEffects(techGrid);
}

function setupInteractiveEffects(container) {
  const cards = container.querySelectorAll('.tech-card');
  let rect = container.getBoundingClientRect();
  let mouseX = 0;
  let mouseY = 0;
  
  // Mouse move parallax effect
  container.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
      const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;
      
      // Calculate distance from mouse to card center
      const deltaX = (mouseX - cardCenterX) / 20;
      const deltaY = (mouseY - cardCenterY) / 20;
      
      // Apply transform based on mouse position
      anime({
        targets: card,
        translateX: deltaX * -0.5,
        translateY: deltaY * -0.5,
        rotateX: deltaY * 0.2,
        rotateY: deltaX * -0.2,
        duration: 400,
        easing: 'easeOutQuad',
        update: function(anim) {
          if (anim.progress > 0) {
            card.style.zIndex = 10;
          }
        },
        complete: function() {
          card.style.zIndex = '';
        }
      });
    });
  });
  
  // Reset on mouse leave
  container.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      anime({
        targets: card,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 800,
        easing: 'easeOutElastic(1, .5)'
      });
    });
  });
  
  // Update rect on window resize
  window.addEventListener('resize', () => {
    rect = container.getBoundingClientRect();
  });
  
  // Card click animation
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Get the tech name from the class
      const techClass = Array.from(card.classList).find(cls => Object.keys(techConfig).includes(cls));
      if (!techClass) return;
      
      // Pulse animation on click
      anime({
        targets: card,
        scale: [1, 1.1, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .5)'
      });
      
      // Special effect for the specific tech
      const particles = card.querySelectorAll('.particle');
      anime({
        targets: particles,
        translateX: () => anime.random(-100, 100),
        translateY: () => anime.random(-100, 100),
        opacity: [0.8, 0],
        scale: [1, 3],
        duration: 1000,
        easing: 'easeOutExpo'
      });
      
      // Create burst effect
      createBurstEffect(card, techConfig[techClass].color);
    });
  });
}

function createBurstEffect(element, color) {
  const rect = element.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = 'tech-burst';
  burst.style.left = rect.width / 2 + 'px';
  burst.style.top = rect.height / 2 + 'px';
  
  element.appendChild(burst);
  
  // Create burst particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'burst-particle';
    particle.style.backgroundColor = color;
    burst.appendChild(particle);
  }
  
  // Animate burst
  anime({
    targets: burst.querySelectorAll('.burst-particle'),
    translateX: () => anime.random(-150, 150),
    translateY: () => anime.random(-150, 150),
    opacity: [1, 0],
    scale: [1, 0],
    duration: () => anime.random(800, 1500),
    easing: 'easeOutExpo',
    complete: () => {
      burst.remove();
    }
  });
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set up intersection observer to trigger animation when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initializeFrontendAnimation();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  
  const section = document.getElementById('frontend-animation');
  if (section) {
    observer.observe(section);
  }
});
