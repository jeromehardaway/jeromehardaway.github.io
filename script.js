// --- Front End Development Banner Animation (Enhanced Implementation) ---
function Banner() {
  const keyword = 'JAVASCRIPT';
  let canvas;
  let context;
  let bgCanvas;
  let bgContext;
  const denseness = 10;
  let parts = [];
  const mouse = {x: -100, y: -100};
  let mouseOnScreen = false;
  let itercount = 0;
  const itertot = 80;
  let animationFrameId;
  const repelRadius = 80;
  const repelStrength = 0.3;
  const easing = 0.04;
  let isInitialized = false;
  let hasStartedAnimation = false;

  this.initialize = function(canvas_id) {
    if (isInitialized) return;
    canvas = document.getElementById(canvas_id);
    if (!canvas) return;
    context = canvas.getContext('2d');
    if (!context) return;
    bgCanvas = document.createElement('canvas');
    bgContext = bgCanvas.getContext('2d');
    if (!bgContext) return;
    canvas.addEventListener('mousemove', MouseMove, false);
    canvas.addEventListener('mouseout', MouseOut, false);
    canvas.addEventListener('touchmove', TouchMove, false);
    canvas.addEventListener('touchend', TouchEnd, false);
    window.addEventListener('resize', debounceResize);
    requestAnimationFrame(() => {
      resizeCanvasOnly();
      isInitialized = true;
      clear();
    });
  };

  const debounceResize = debounce(() => {
    if (hasStartedAnimation) resizeCanvas();
    else resizeCanvasOnly();
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

  const resizeCanvasOnly = () => {
    if (!canvas || !context) return;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const W = window.innerWidth;
    const H = Math.round(window.innerHeight * 0.7);
    const dpr = window.devicePixelRatio || 1;
    const newWidth = W * dpr;
    const newHeight = H * dpr;
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      context.scale(dpr, dpr);
      bgCanvas.width = newWidth;
      bgCanvas.height = newHeight;
      bgContext.scale(dpr, dpr);
      parts = [];
      itercount = 0;
    }
    clear();
  };

  const resizeCanvas = () => {
    resizeCanvasOnly();
    start();
  };

  const start = function() {
    if (animationFrameId) return;
    hasStartedAnimation = true;
    clear();
    getCoords();
  };

  this.startAnimation = async function() {
    if (!isInitialized || hasStartedAnimation) return;
    await new Promise(resolve => setTimeout(resolve, 100));
    requestAnimationFrame(function() {
      start();
    });
  };

  const getCoords = function() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgContext.fillStyle = '#ffffff';
    const dpr = window.devicePixelRatio || 1;
    const fontSize = Math.min(200, Math.max(50, canvas.width / (8 * dpr)));
    bgContext.font = `bold ${fontSize}px Impact, IBM Plex Sans, Arial, sans-serif`;
    bgContext.textAlign = 'center';
    bgContext.textBaseline = 'middle';
    const x = bgCanvas.width / (2 * dpr);
    const y = bgCanvas.height / (2 * dpr);
    bgContext.fillText(keyword, x, y);
    let imageData = bgContext.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    const canvasSize = bgCanvas.width * bgCanvas.height;
    const adjustedDenseness = Math.max(5, Math.min(15, Math.sqrt(canvasSize) / 100));
    for (let height = 0; height < bgCanvas.height; height += adjustedDenseness) {
      for (let width = 0; width < bgCanvas.width; width += adjustedDenseness) {
        const index = (width + (height * bgCanvas.width)) * 4;
        if (imageData.data[index] > 200 && imageData.data[index + 1] > 200 && imageData.data[index + 2] > 200 && imageData.data[index + 3] > 200) {
          drawCircle(width / dpr, height / dpr);
        }
      }
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
  };

  const drawCircle = function(x, y) {
    const startx = Math.random() * canvas.width / (window.devicePixelRatio || 1);
    const starty = Math.random() * canvas.height / (window.devicePixelRatio || 1);
    const velx = (x - startx) / itertot;
    const vely = (y - starty) / itertot;
    const colors = ['#c5203e', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 2 + Math.random() * 3;
    parts.push({
      c: color,
      x: x,
      y: y,
      x2: startx,
      y2: starty,
      size: size,
      r: true,
      v: {x: velx, y: vely},
      home: {x: x, y: y}
    });
  };

  const animate = function() {
    update();
    animationFrameId = requestAnimationFrame(animate);
  };

  const update = function() {
    itercount++;
    clear();
    if (parts.length === 0 && itercount > 10) {
      start();
      return;
    }
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (itercount <= itertot && part.r === true) {
        part.x2 += part.v.x * 0.6;
        part.y2 += part.v.y * 0.6;
      } else if (itercount > itertot) {
        if (mouseOnScreen) {
          const dx = part.x2 - mouse.x;
          const dy = part.y2 - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < repelRadius) {
            const force = (1 - distance / repelRadius) * repelStrength;
            const angle = Math.atan2(dy, dx);
            const repelX = Math.cos(angle) * force;
            const repelY = Math.sin(angle) * force;
            part.x2 += repelX * 3;
            part.y2 += repelY * 3;
            part.r = true;
          }
        }
        if (part.r) {
          part.x2 += (part.home.x - part.x2) * easing;
          part.y2 += (part.home.y - part.y2) * easing;
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
      const particleSize = part.size || 4;
      context.fillStyle = part.c;
      context.beginPath();
      context.arc(part.x2, part.y2, particleSize, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  };

  const MouseMove = function(e) {
    e.preventDefault();
    mouseOnScreen = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1));
    const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1));
    mouse.x = ((e.clientX - rect.left) * scaleX);
    mouse.y = ((e.clientY - rect.top) * scaleY);
  };

  const TouchMove = function(e) {
    e.preventDefault();
    mouseOnScreen = true;
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1));
      const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1));
      mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
      mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
    }
  };

  const MouseOut = function(e) {
    mouseOnScreen = false;
    mouse.x = -100;
    mouse.y = -100;
  };

  const TouchEnd = function(e) {
    mouseOnScreen = false;
    mouse.x = -100;
    mouse.y = -100;
  };

  const clear = function() {
    context.fillStyle = '#091f40';
    context.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  };
}

// Initialize banner on DOM content loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Short delay to ensure DOM is stable before any initialization
  await wait(300);
  
  // Initialize Banner (just set up, don't start animation yet)
  initBanner();
  
  // Wait a bit more to ensure all layout is complete before setting up observer
  await wait(500);
  
  // Set up Intersection Observer to start animation when fully visible
  setupBannerIntersectionObserver();
});

// Create a global banner reference
var bannerInstance;

function initBanner() {
  var canvasElement = document.getElementById('canvas');
  if (canvasElement) {
    console.log('Initializing banner with canvas element');
    try {
      bannerInstance = new Banner();
      bannerInstance.initialize('canvas');
      
      // Add a small message to indicate initialization status
      const statusElement = document.createElement('div');
      statusElement.style.position = 'absolute';
      statusElement.style.bottom = '10px';
      statusElement.style.right = '10px';
      statusElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
      statusElement.style.color = 'white';
      statusElement.style.padding = '5px 10px';
      statusElement.style.borderRadius = '3px';
      statusElement.style.fontSize = '12px';
      statusElement.style.zIndex = '1000';
      statusElement.textContent = 'Banner initialized';
      document.body.appendChild(statusElement);
      
      setTimeout(() => {
        statusElement.style.opacity = '0';
        statusElement.style.transition = 'opacity 1s ease';
        setTimeout(() => statusElement.remove(), 1000);
      }, 3000);
    } catch (e) {
      console.error('Error initializing banner:', e);
      
      // Show error message on the canvas element
      const errorMsg = document.createElement('div');
      errorMsg.style.position = 'absolute';
      errorMsg.style.top = '50%';
      errorMsg.style.left = '50%';
      errorMsg.style.transform = 'translate(-50%, -50%)';
      errorMsg.style.color = 'white';
      errorMsg.style.backgroundColor = 'rgba(255,0,0,0.7)';
      errorMsg.style.padding = '10px';
      errorMsg.style.borderRadius = '5px';
      errorMsg.style.zIndex = '1000';
      errorMsg.textContent = 'Canvas initialization error: ' + e.message;
      canvasElement.parentNode.appendChild(errorMsg);
    }
  } else {
    console.error('Canvas element not found');
    
    // Add error message to the frontend-banner section
    const bannerSection = document.getElementById('frontend-banner');
    if (bannerSection) {
      const errorMsg = document.createElement('div');
      errorMsg.style.textAlign = 'center';
      errorMsg.style.padding = '20px';
      errorMsg.style.color = 'white';
      errorMsg.style.backgroundColor = 'rgba(255,0,0,0.7)';
      errorMsg.textContent = 'Canvas element not found. Please check your HTML.';
      bannerSection.appendChild(errorMsg);
    }
  }
}

function setupBannerIntersectionObserver() {
  if (!bannerInstance) {
    console.error('Banner instance not initialized');
    return;
  }
  
  // Get the section that contains the canvas
  var bannerSection = document.getElementById('frontend-banner');
  if (!bannerSection) {
    console.error('Banner section not found');
    
    // Fallback: Just start the animation directly if we can't find the section
    setTimeout(() => {
      if (bannerInstance) {
        console.log('Fallback: Starting animation directly');
        bannerInstance.startAnimation();
      }
    }, 1000);
    
    return;
  }
  
  console.log('Setting up intersection observer for banner');
  
  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, starting animation directly');
    
    // Fallback for browsers that don't support IntersectionObserver
    setTimeout(() => {
      bannerInstance.startAnimation();
    }, 1000);
    
    return;
  }
  
  // Create an intersection observer
  try {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(async function(entry) {
        // If the section is fully visible (or nearly so) and banner exists
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9 && bannerInstance) {
          console.log('Banner is visible, starting animation');
          
          // Delay animation start slightly to ensure rendering is stable
          await wait(200);
          
          // Start the animation smoothly
          requestAnimationFrame(function() {
            bannerInstance.startAnimation();
          });
          
          // Once started, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      // Only trigger when nearly 100% of the section is visible
      threshold: [0.9, 1.0],
      // Add rootMargin to trigger a bit before the element is fully in view
      rootMargin: '0px 0px -10% 0px'
    });
    
    // Start observing the banner section
    observer.observe(bannerSection);
    console.log('Banner observer set up');
  } catch (e) {
    console.error('Error setting up IntersectionObserver:', e);
    
    // Fallback if observer setup fails
    setTimeout(() => {
      bannerInstance.startAnimation();
    }, 1000);
  }
}

// Add console.log to help debug
console.log('Script.js loaded successfully');

// --- ETL Animation ---
function setupETLAnimation() {
  // Get elements
  const extractEl = document.querySelector('.extract');
  const transformEl = document.querySelector('.transform');
  const loadEl = document.querySelector('.load');
  
  // Only proceed if all elements exist
  if (!extractEl || !transformEl || !loadEl) return;
  
  // Animate icons
  function animateIcons() {
    // Subtle rotation animation for extract icon
    anime({
      targets: '.extract i',
      translateY: [0, -5, 0],
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true,
      delay: 500
    });
    
    // Rotation animation for transform icon
    anime({
      targets: '.transform i',
      rotate: '360deg',
      duration: 8000,
      loop: true,
      easing: 'linear'
    });
    
    // Fade animation for load icon
    anime({
      targets: '.load i',
      opacity: [0.6, 1, 0.6],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuad'
    });
  }
  
  // Animate the decorative elements
  function animateDecorations() {
    anime({
      targets: '.pipeline-decoration',
      opacity: [0.05, 0.1, 0.05],
      scale: [1, 1.1, 1],
      duration: 5000,
      loop: true,
      easing: 'easeInOutSine',
      delay: anime.stagger(1000)
    });
  }
  
  // Add hover effects for stages
  function setupHoverEffects() {
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => {
      stage.addEventListener('mouseenter', () => {
        anime({
          targets: stage,
          borderWidth: ['3px', '5px'],
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
      
      stage.addEventListener('mouseleave', () => {
        anime({
          targets: stage,
          borderWidth: '3px',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });
  }
  
  // Main animation function
  function animateETL() {
    // Start icon animations
    animateIcons();
    
    // Animate decorative elements
    animateDecorations();
    
    // Setup hover effects
    setupHoverEffects();
  }
  
  // Run animation when section becomes visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start the animation with a small delay to ensure everything is rendered
        setTimeout(() => {
          animateETL();
        }, 300);
      }
    });
  }, { threshold: 0.3 });
  
  const section = document.getElementById('data-engineering');
  if (section) {
    observer.observe(section);
  }
}

// Initialize all animations on DOM content loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Short delay to ensure DOM is stable before any initialization
  await wait(300);
  
  // Initialize Banner (just set up, don't start animation yet)
  initBanner();
  
  // Initialize ETL Animation
  setupETLAnimation();
  
  // Wait a bit more to ensure all layout is complete before setting up observer
  await wait(500);
  
  // Set up Intersection Observer to start animation when fully visible
  setupBannerIntersectionObserver();
});

// Initialize all animations on DOM content loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Short delay to ensure DOM is stable before any initialization
  await wait(300);
  
  // Initialize Banner (just set up, don't start animation yet)
  initBanner();
  
  // Initialize ETL Animation
  setupETLAnimation();
  
  // Wait a bit more to ensure all layout is complete before setting up observer
  await wait(500);
  
  // Set up Intersection Observer to start animation when fully visible
  setupBannerIntersectionObserver();
});

// Initialize all animations on DOM content loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Short delay to ensure DOM is stable before any initialization
  await wait(300);
  
  // Initialize Banner (just set up, don't start animation yet)
  initBanner();
  
  // Initialize ETL Animation
  setupETLAnimation();
  
  // Wait a bit more to ensure all layout is complete before setting up observer
  await wait(500);
  
  // Set up Intersection Observer to start animation when fully visible
  setupBannerIntersectionObserver();
});