// --- Front End Development Banner Animation (Enhanced Implementation) ---
function Banner() {
  var keyword = 'JAVASCRIPT';
  var canvas;
  var context;
  var bgCanvas;
  var bgContext;
  var denseness = 10;
  var parts = [];
  var mouse = {x: -100, y: -100};
  var mouseOnScreen = false;
  var itercount = 0;
  var itertot = 80; // Increased from 40 to 80 to make initial animation slower
  var animationFrameId;
  var repelRadius = 80; // Maximum distance for particles to be affected by mouse
  var repelStrength = 0.3; // Reduced from 0.5 to 0.3 for gentler repulsion
  var easing = 0.04; // Reduced from 0.08 to 0.04 for slower return to position

  this.initialize = function(canvas_id) {
    canvas = document.getElementById(canvas_id);
    if (!canvas) {
      return;
    }
    
    // Try to get context
    try {
      context = canvas.getContext('2d');
      if (!context) {
        return;
      }
    } catch (e) {
      return;
    }
    
    // Set up background canvas
    try {
      bgCanvas = document.createElement('canvas');
      bgContext = bgCanvas.getContext('2d');
    } catch (e) {
      return;
    }
    
    // Set up events
    try {
      canvas.addEventListener('mousemove', MouseMove, false);
      canvas.addEventListener('mouseout', MouseOut, false);
      canvas.addEventListener('touchmove', TouchMove, false);
      canvas.addEventListener('touchend', TouchEnd, false);
    } catch (e) {
    }
    
    // Initial resize
    try {
      resizeCanvas();
    } catch (e) {
    }
    
    // Add resize handler
    window.addEventListener('resize', debounceResize);
  };
  
  var debounceResize = debounce(() => {
    resizeCanvas();
  }, 150);

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  var resizeCanvas = () => {
    var W = window.innerWidth;
    var H = Math.round(window.innerHeight * 0.7);
    
    // Apply device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    context.scale(dpr, dpr);
    
    if (bgCanvas) {
      bgCanvas.width = W * dpr;
      bgCanvas.height = H * dpr;
      bgContext.scale(dpr, dpr);
    }
    
    // Reset animation state
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    parts = [];
    itercount = 0;
    start();
  };

  var start = function() {
    // Note: We'll render the text directly in getCoords to avoid duplication
    
    // Clear the canvas first
    clear();
    
    // Get coordinates from text rendering
    getCoords();
  };

  var getCoords = function() {
    // Clear before rendering text
    bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Use pure white for better detection
    bgContext.fillStyle = '#ffffff';
    
    // Responsive font size based on canvas width
    const dpr = window.devicePixelRatio || 1;
    const fontSize = Math.min(200, Math.max(50, canvas.width / (8 * dpr)));
    bgContext.font = `bold ${fontSize}px Impact, IBM Plex Sans, Arial, sans-serif`;
    bgContext.textAlign = 'center';
    bgContext.textBaseline = 'middle';
    
    // Center text
    const x = bgCanvas.width / (2 * dpr);
    const y = bgCanvas.height / (2 * dpr);
    
    // Draw text
    bgContext.fillText(keyword, x, y);
    
    // Get image data from the background canvas
    var imageData = bgContext.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Adaptive denseness based on canvas size and text size
    const canvasSize = bgCanvas.width * bgCanvas.height;
    let adjustedDenseness = Math.max(5, Math.min(15, Math.sqrt(canvasSize) / 100));
    
    // Count detected pixels for debugging
    let detectedPixels = 0;
    
    // Loop through the canvas to find white pixels (text)
    for (let height = 0; height < bgCanvas.height; height += adjustedDenseness) {
      for (let width = 0; width < bgCanvas.width; width += adjustedDenseness) {
        const index = (width + (height * bgCanvas.width)) * 4;
        
        // Check if the pixel is white (RGB values close to 255)
        // Using a threshold to account for anti-aliasing
        if (imageData.data[index] > 200 && 
            imageData.data[index + 1] > 200 && 
            imageData.data[index + 2] > 200 && 
            imageData.data[index + 3] > 200) {
          
          drawCircle(width / dpr, height / dpr);
          detectedPixels++;
        }
      }
    }
    
    // If we didn't find any pixels, try again with a different approach
    if (detectedPixels === 0) {
      console.warn('No pixels detected in the text. Trying alternative method...');
      
      // Reset and try a different approach
      bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      bgContext.fillStyle = '#ffffff';
      bgContext.font = `bold ${fontSize * 1.5}px Arial, sans-serif`;
      bgContext.fillText(keyword, x, y);
      
      imageData = bgContext.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
      
      // Try with a lower threshold
      for (let height = 0; height < bgCanvas.height; height += adjustedDenseness / 2) {
        for (let width = 0; width < bgCanvas.width; width += adjustedDenseness / 2) {
          const index = (width + (height * bgCanvas.width)) * 4;
          
          // Lower threshold
          if (imageData.data[index] > 150) {
            drawCircle(width / dpr, height / dpr);
            detectedPixels++;
          }
        }
      }
    }
    
    // Use requestAnimationFrame for animation
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(animate);
  };

  var drawCircle = function(x, y) {
    // Generate random starting position anywhere on the canvas
    var startx = Math.random() * canvas.width / (window.devicePixelRatio || 1);
    var starty = Math.random() * canvas.height / (window.devicePixelRatio || 1);
    
    // Calculate velocity for smooth transition to destination
    var velx = (x - startx) / itertot;
    var vely = (y - starty) / itertot;
    
    // Alternate between red and white particles
    const colors = ['#c5203e', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Size variation for more natural look
    const size = 2 + Math.random() * 3;
    
    parts.push({
      c: color,
      x: x,         // Target x position (in text)
      y: y,         // Target y position (in text)
      x2: startx,   // Current x position
      y2: starty,   // Current y position
      size: size,   // Particle size
      r: true,      // In motion flag
      v: {x: velx, y: vely},  // Current velocity
      home: {x: x, y: y}      // Original position to return to
    });
  };

  var animate = function() {
    update();
    animationFrameId = requestAnimationFrame(animate);
  };

  var update = function() {
    itercount++;
    clear();
    
    // If no particles generated, retry
    if (parts.length === 0 && itercount > 10) {
      start();
      return;
    }
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Flying into position phase (initial animation)
      if (itercount <= itertot && part.r === true) {
        // Slow down the initial particle movement with a multiplier
        part.x2 += part.v.x * 0.6; // Reduced to 60% speed
        part.y2 += part.v.y * 0.6; // Reduced to 60% speed
      } 
      // After formation, apply interactive behavior
      else if (itercount > itertot) {
        // Check for mouse repulsion
        if (mouseOnScreen) {
          let dx = part.x2 - mouse.x;
          let dy = part.y2 - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          // Apply repelling force if mouse is close enough
          if (distance < repelRadius) {
            // Force decreases with distance
            let force = (1 - distance / repelRadius) * repelStrength;
            
            // Calculate repulsion vector (normalized)
            let angle = Math.atan2(dy, dx);
            let repelX = Math.cos(angle) * force;
            let repelY = Math.sin(angle) * force;
            
            // Apply repulsion
            part.x2 += repelX * 3; // Reduced from 5 to 3 for gentler repulsion
            part.y2 += repelY * 3; // Reduced from 5 to 3 for gentler repulsion
            part.r = true;  // Mark as needing to return home
          }
        }
        
        // Apply easing to return to original position
        if (part.r) {
          // Easing formula: current += (target - current) * easing
          part.x2 += (part.home.x - part.x2) * easing;
          part.y2 += (part.home.y - part.y2) * easing;
          
          // If close enough to home, stop easing
          const homeDx = part.home.x - part.x2;
          const homeDy = part.home.y - part.y2;
          const homeDistance = Math.sqrt(homeDx * homeDx + homeDy * homeDy);
          
          if (homeDistance < 0.5) {
            part.r = false;
            part.x2 = part.home.x;
            part.y2 = part.home.y;
          }
        }
      }
      
      // Make particles slightly larger for better visibility
      const particleSize = part.size || 4;
      
      // Draw the particle
      context.fillStyle = part.c;
      context.beginPath();
      context.arc(part.x2, part.y2, particleSize, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  };

  var MouseMove = function(e) {
    e.preventDefault();
    mouseOnScreen = true;
    
    // Get accurate mouse position relative to canvas
    const scaleX = canvas.width / (cachedRect.width * cachedDevicePixelRatio);
    const scaleY = canvas.height / (cachedRect.height * cachedDevicePixelRatio);
    
    mouse.x = ((e.clientX - rect.left) * scaleX);
    mouse.y = ((e.clientY - rect.top) * scaleY);
  };

  var TouchMove = function(e) {
    e.preventDefault();
    mouseOnScreen = true;
    
    if (e.touches.length > 0) {
      // Use cached values for rect and scale
      mouse.x = (e.touches[0].clientX - cachedRect.left) * cachedScaleX;
      mouse.y = (e.touches[0].clientY - cachedRect.top) * cachedScaleY;
    }
  };

  var MouseOut = function(e) {
    mouseOnScreen = false;
    mouse.x = -100;
    mouse.y = -100;
  };

  var TouchEnd = function(e) {
    mouseOnScreen = false;
    mouse.x = -100;
    mouse.y = -100;
  };

  var clear = function() {
    // Use fillRect instead of path for better performance
    context.fillStyle = '#091f40';
    context.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  };
}

// Add a small delay to ensure the DOM is fully rendered
document.addEventListener('DOMContentLoaded', function () {
  // Try to initialize immediately
  initBanner();
  
  // Also try with a slight delay as a fallback
  setTimeout(initBanner, 100);
});

function initBanner() {
  var canvasElement = document.getElementById('canvas');
  if (canvasElement) {
    var banner = new Banner();
    banner.initialize('canvas');
  }
}
// --- Skills Web Graph Connections ---
document.addEventListener('DOMContentLoaded', function () {
  const svg = document.getElementById('skills-graph-svg');
  const nodes = document.querySelectorAll('#skills-graph-nodes .skills-node');
  if (!svg || nodes.length !== 3) return;

  // Helper: get center of a node
  function getNodeCenter(node) {
    const rect = node.getBoundingClientRect();
    const parentRect = node.parentElement.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2
    };
  }

  // Draw lines between the three main nodes (triangle)
  function drawLines() {
    svg.innerHTML = '';
    const [dataNode, mlNode, aiNode] = nodes;
    const c1 = getNodeCenter(dataNode);
    const c2 = getNodeCenter(mlNode);
    const c3 = getNodeCenter(aiNode);

    // Main triangle
    const lines = [
      [c1, c2],
      [c2, c3],
      [c3, c1]
    ];
    lines.forEach((pair, i) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', pair[0].x);
      line.setAttribute('y1', pair[0].y);
      line.setAttribute('x2', pair[1].x);
      line.setAttribute('y2', pair[1].y);
      line.setAttribute('stroke', '#c5203e');
      line.setAttribute('stroke-width', '4');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.7');
      svg.appendChild(line);
      // Animate line drawing
      if (typeof anime !== 'undefined') {
        anime({
          targets: line,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 1200,
          delay: i * 200,
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: false
        });
      }
    });

    // Draw lines from each node to its tools (sub-nodes)
    [dataNode, mlNode, aiNode].forEach((node, idx) => {
      const center = getNodeCenter(node);
      const tools = node.querySelectorAll('.tool');
      tools.forEach((tool, tIdx) => {
        const tRect = tool.getBoundingClientRect();
        const pRect = node.parentElement.getBoundingClientRect();
        const tx = tRect.left - pRect.left + tRect.width / 2;
        const ty = tRect.top - pRect.top + tRect.height / 2;
        const tline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tline.setAttribute('x1', center.x);
        tline.setAttribute('y1', center.y);
        tline.setAttribute('x2', tx);
        tline.setAttribute('y2', ty);
        tline.setAttribute('stroke', '#e84e6a');
        tline.setAttribute('stroke-width', '2');
        tline.setAttribute('stroke-linecap', 'round');
        tline.setAttribute('opacity', '0.4');
        svg.appendChild(tline);
        // Animate sub-node lines
        if (typeof anime !== 'undefined') {
          anime({
            targets: tline,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 900,
            delay: 600 + tIdx * 40 + idx * 100,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: false
          });
        }
      });
    });
  }

  // Redraw on resize for responsiveness
  window.addEventListener('resize', () => setTimeout(drawLines, 300));
  setTimeout(drawLines, 400); // Initial draw after layout
});
// Live Data Pipeline Animation
document.addEventListener('DOMContentLoaded', function () {
  // Progress Bar Animation
  function animateProgressBar(barId, fillId, min, max, duration, delay) {
    var fill = document.getElementById(fillId);
    if (!fill) return;
    anime({
      targets: fill,
      width: [min + '%', max + '%'],
      easing: 'easeInOutSine',
      duration: duration,
      direction: 'alternate',
      loop: true,
      delay: delay
    });
  }

  animateProgressBar('progress-ingest', 'progress-ingest-fill', 10, 95, 2200, 0);
  animateProgressBar('progress-transform', 'progress-transform-fill', 5, 85, 1800, 400);
  animateProgressBar('progress-load', 'progress-load-fill', 15, 100, 2600, 800);

  // Streaming Chart Bars
  var streamBarsContainer = document.getElementById('stream-bars');
  if (streamBarsContainer) {
    // Create 30 bars
    for (let i = 0; i < 30; i++) {
      let bar = document.createElement('div');
      bar.className = 'stream-bar';
      bar.setAttribute('role', 'presentation');
      streamBarsContainer.appendChild(bar);
    }
    var bars = Array.from(streamBarsContainer.children);
    // Animate bars
    bars.forEach((bar, i) => {
      anime({
        targets: bar,
        height: [20 + Math.random() * 40, 60 + Math.random() * 20],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 900 + Math.random() * 800,
        delay: i * 40,
        loop: true
      });
    });
  }
});
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
          if (typeof anime !== 'undefined') {
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
          }
        });
      } else if (!this.isInView(this.projectsSection) && this.isAnimating) {
        this.isAnimating = false;
        if (typeof anime !== 'undefined') {
          anime.remove(this.projectCards);
        }
      }
    });
  }

  isInView(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
}

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
    if (!this.toggleBtn) return;
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
    if (!this.nav || !this.hamburgerMenu) return;
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
    if (!this.header) return;
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
    if (!this.sections || !this.navLinks) return;
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
    if (!this.navLinks) return;
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

// --- 3D Skills Graph with Three.js ---
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

    // 3D Skills Graph
    initSkills3DGraph();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

function initSkills3DGraph() {
  const canvas = document.getElementById('skills-3d-canvas');
  const tooltip = document.getElementById('skills-tooltip');
  if (!canvas || !window.THREE) return;

  // --- Skills Data ---
  const skills = [
    // Data Engineering
    { name: 'Data Engineering', group: 'Data', color: '#c5203e', size: 1.2, description: 'Data pipelines, ETL, cloud data infra', main: true },
    { name: 'Python', group: 'Data', color: '#fff', size: 0.8, description: 'Python for data engineering', main: false },
    { name: 'SQL', group: 'Data', color: '#fff', size: 0.8, description: 'SQL for analytics and pipelines', main: false },
    { name: 'Databricks', group: 'Data', color: '#fff', size: 0.8, description: 'Databricks platform', main: false },
    { name: 'Azure Data', group: 'Data', color: '#fff', size: 0.8, description: 'Azure Data Services', main: false },
    { name: 'Streaming', group: 'Data', color: '#fff', size: 0.8, description: 'Streaming data pipelines', main: false },
    // ML
    { name: 'Machine Learning', group: 'ML', color: '#c5203e', size: 1.2, description: 'ML models, MLOps, deployment', main: true },
    { name: 'scikit-learn', group: 'ML', color: '#fff', size: 0.8, description: 'scikit-learn for ML', main: false },
    { name: 'TensorFlow', group: 'ML', color: '#fff', size: 0.8, description: 'TensorFlow for deep learning', main: false },
    { name: 'PyTorch', group: 'ML', color: '#fff', size: 0.8, description: 'PyTorch for deep learning', main: false },
    { name: 'MLOps', group: 'ML', color: '#fff', size: 0.8, description: 'ML operations and deployment', main: false },
    // AI
    { name: 'AI', group: 'AI', color: '#c5203e', size: 1.2, description: 'LLMs, generative AI, cloud AI', main: true },
    { name: 'Azure OpenAI', group: 'AI', color: '#fff', size: 0.8, description: 'Azure OpenAI platform', main: false },
    { name: 'Google Gemini', group: 'AI', color: '#fff', size: 0.8, description: 'Google Gemini LLMs', main: false },
    { name: 'LLMs', group: 'AI', color: '#fff', size: 0.8, description: 'Large Language Models', main: false },
    { name: 'Generative AI', group: 'AI', color: '#fff', size: 0.8, description: 'Generative AI techniques', main: false },
  ];
  // Edges: connect main to sub-skills, and main nodes to each other
  const edges = [
    // Data main
    [0,1],[0,2],[0,3],[0,4],[0,5],
    // ML main
    [6,7],[6,8],[6,9],[6,10],
    // AI main
    [11,12],[11,13],[11,14],[11,15],
    // Main nodes triangle
    [0,6],[6,11],[11,0]
  ];

  // --- Three.js Setup ---
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x091f40, 0); // transparent bg
  const width = canvas.clientWidth || canvas.offsetWidth || 600;
  const height = canvas.clientHeight || canvas.offsetHeight || 400;
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 100);
  camera.position.set(0, 0, 10);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.7);
  directional.position.set(5,5,10);
  scene.add(directional);

  // --- Node Objects ---
  const nodeObjs = skills.map((skill, i) => {
    const geometry = new THREE.SphereGeometry(skill.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: skill.color, emissive: skill.main ? 0xc5203e : 0x222222, emissiveIntensity: skill.main ? 0.5 : 0.15, transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ...skill, index: i };
    scene.add(mesh);
    return mesh;
  });

  // --- 2D Labels for Spheres ---
  // Create a label div for each node
  const labelContainer = document.createElement('div');
  labelContainer.style.position = 'absolute';
  labelContainer.style.left = '0';
  labelContainer.style.top = '0';
  labelContainer.style.pointerEvents = 'none';
  labelContainer.style.width = '100%';
  labelContainer.style.height = '100%';
  labelContainer.style.zIndex = '2';
  labelContainer.setAttribute('aria-hidden', 'true');
  canvas.parentElement.appendChild(labelContainer);

  const labels = nodeObjs.map((obj, i) => {
    const label = document.createElement('div');
    label.textContent = skills[i].name;
    label.style.position = 'absolute';
    label.style.color = skills[i].main ? '#fff' : '#fff';
    label.style.fontWeight = skills[i].main ? 'bold' : 'normal';
    label.style.fontSize = skills[i].main ? '1.1rem' : '0.95rem';
    label.style.textShadow = '0 2px 8px #091f40, 0 0px 2px #000';
    label.style.padding = '2px 8px';
    label.style.borderRadius = '8px';
    label.style.background = skills[i].main ? 'rgba(197,32,62,0.85)' : 'rgba(9,31,64,0.7)';
    label.style.opacity = '0.92';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.pointerEvents = 'none';
    labelContainer.appendChild(label);
    return label;
  });

  // --- Force-directed Layout ---
  // Initial positions: main nodes in triangle, sub-nodes around their main
  const mainPos = [
    [ -4, 1.5, 0 ], // Data
    [ 0, -3, 0 ],   // ML
    [ 4, 1.5, 0 ]   // AI
  ];
  nodeObjs.forEach((obj, i) => {
    if (skills[i].main) {
      // Place main nodes
      obj.position.set(...mainPos.shift());
    } else if (skills[i].group === 'Data') {
      obj.position.set(-4 + Math.random()*2-1, 2.5-Math.random()*2, Math.random()*2-1);
    } else if (skills[i].group === 'ML') {
      obj.position.set(-1+Math.random()*2, -3.5+Math.random()*2, Math.random()*2-1);
    } else if (skills[i].group === 'AI') {
      obj.position.set(4+Math.random()*2-1, 2.5-Math.random()*2, Math.random()*2-1);
    }
  });

  // --- Edge Objects ---
  const edgeObjs = edges.map(([a,b]) => {
    const mat = new THREE.LineBasicMaterial({ color: 0xc5203e, transparent: true, opacity: 0.5 });
    const pts = [ nodeObjs[a].position.clone(), nodeObjs[b].position.clone() ];
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    return { line, a, b };
  });

  // --- Force Simulation ---
  function applyForces() {
    // Simple repulsion and spring forces
    for (let i=0; i<nodeObjs.length; ++i) {
      let objA = nodeObjs[i];
      objA.userData.v = objA.userData.v || new THREE.Vector3();
      for (let j=0; j<nodeObjs.length; ++j) {
        if (i===j) continue;
        let objB = nodeObjs[j];
        let d = objA.position.clone().sub(objB.position);
        let dist = d.length();
        if (dist < 0.01) continue;
        // Repulsion
        let repulse = 0.04 / (dist*dist);
        objA.userData.v.add(d.normalize().multiplyScalar(repulse));
      }
    }
    // Spring edges
    edgeObjs.forEach(({a,b}) => {
      let objA = nodeObjs[a], objB = nodeObjs[b];
      let d = objB.position.clone().sub(objA.position);
      let dist = d.length();
      let spring = 0.04 * (dist-2.2); // target length
      objA.userData.v.add(d.normalize().multiplyScalar(spring));
      objB.userData.v.add(d.normalize().multiplyScalar(-spring));
    });
    // Apply velocity, dampen
    nodeObjs.forEach(obj => {
      obj.position.add(obj.userData.v.clone().multiplyScalar(0.12));
      obj.userData.v.multiplyScalar(0.85);
    });
  }

  // --- Animation Loop ---
  let animating = true;
  function animate() {
    if (!animating) return;
    applyForces();
    // Update edge positions
    edgeObjs.forEach(({line,a,b}) => {
      const pts = [ nodeObjs[a].position, nodeObjs[b].position ];
      line.geometry.setFromPoints(pts);
    });
    // Subtle rotation
    scene.rotation.y += 0.002;
    // Update 2D label positions
    nodeObjs.forEach((obj, i) => {
      const vector = obj.position.clone();
      vector.project(camera);
      const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * canvas.clientHeight;
      labels[i].style.left = `${x}px`;
      labels[i].style.top = `${y}px`;
      // Hide if behind camera
      labels[i].style.display = (vector.z < 1) ? 'block' : 'none';
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // --- Interactivity ---
  // Raycaster for hover
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;
  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeObjs);
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (hovered !== obj) {
        if (hovered) hovered.material.emissiveIntensity = hovered.userData.main ? 0.5 : 0.15;
        hovered = obj;
        hovered.material.emissiveIntensity = 1.0;
        // Tooltip
        tooltip.style.display = 'block';
        tooltip.innerHTML = `<strong>${hovered.userData.name}</strong><br><span style='font-size:0.95em;'>${hovered.userData.description}</span>`;
        tooltip.style.left = event.clientX + 12 + 'px';
        tooltip.style.top = event.clientY - 12 + 'px';
      } else {
        // Move tooltip
        tooltip.style.left = event.clientX + 12 + 'px';
        tooltip.style.top = event.clientY - 12 + 'px';
      }
      canvas.style.cursor = 'pointer';
    } else {
      if (hovered) hovered.material.emissiveIntensity = hovered.userData.main ? 0.5 : 0.15;
      hovered = null;
      tooltip.style.display = 'none';
      canvas.style.cursor = '';
    }
  }
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('mouseleave', () => {
    if (hovered) hovered.material.emissiveIntensity = hovered.userData.main ? 0.5 : 0.15;
    hovered = null;
    tooltip.style.display = 'none';
    canvas.style.cursor = '';
  });

  // Drag to rotate
  let isDragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener('pointerdown', e => {
    isDragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', e => {
    isDragging = false;
    canvas.releasePointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = (e.clientX - lastX) * 0.01;
    const dy = (e.clientY - lastY) * 0.01;
    scene.rotation.y += dx;
    scene.rotation.x += dy;
    lastX = e.clientX; lastY = e.clientY;
  });

  // Keyboard accessibility: focus and arrow rotate
  canvas.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') scene.rotation.y -= 0.1;
    if (e.key === 'ArrowRight') scene.rotation.y += 0.1;
    if (e.key === 'ArrowUp') scene.rotation.x -= 0.1;
    if (e.key === 'ArrowDown') scene.rotation.x += 0.1;
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth || canvas.offsetWidth || 600;
    const h = canvas.clientHeight || canvas.offsetHeight || 400;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // Animate main nodes with Anime.js pulse
  if (window.anime) {
    nodeObjs.forEach((obj, i) => {
      if (skills[i].main) {
        anime({
          targets: obj.scale,
          x: [1, 1.18, 1],
          y: [1, 1.18, 1],
          z: [1, 1.18, 1],
          duration: 2200,
          delay: i*400,
          loop: true,
          easing: 'easeInOutSine'
        });
      }
    });
  }
}