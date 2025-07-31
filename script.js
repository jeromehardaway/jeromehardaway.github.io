// --- Front End Development Banner Animation (Enhanced Implementation) ---
function Banner() {
  let keywords = ['HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'NEXT.JS', 'TAILWIND'];
  let currentKeywordIndex = 0;
  let canvas;
  let context;
  let bgCanvas;
  let bgContext;
  const denseness = 10;
  let parts = [];
  const mouse = { x: -100, y: -100 };
  let mouseOnScreen = false;
  let itercount = 0;
  const itertot = 80;
  let animationFrameId;
  const repelRadius = 80;
  const repelStrength = 0.3;
  const easing = 0.04;
  let isInitialized = false;
  let hasStartedAnimation = false;
  let animationInterval;

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
    const parent = canvas.parentElement;
    if (!parent) return;

    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const W = parent.clientWidth;
    const H = parent.clientHeight;
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
    if (!hasStartedAnimation) return;
    itercount = 0;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    clear();
    getCoords();
  };

  const cycleKeywords = () => {
    currentKeywordIndex = (currentKeywordIndex + 1) % keywords.length;
    start();
  };

  this.startAnimation = async function() {
    if (!isInitialized || hasStartedAnimation) return;
    hasStartedAnimation = true;
    await new Promise(resolve => setTimeout(resolve, 100));
    requestAnimationFrame(function() {
      start();
      if (animationInterval) clearInterval(animationInterval);
      animationInterval = setInterval(cycleKeywords, 4000); // Change keyword every 4 seconds
    });
  };

  const getCoords = function() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    parts = [];
    bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgContext.fillStyle = '#ffffff';
    const dpr = window.devicePixelRatio || 1;
    const fontSize = Math.min(120, Math.max(40, canvas.width / (9 * dpr)));
    bgContext.font = `bold ${fontSize}px "IBM Plex Sans", Arial, sans-serif`;
    bgContext.textAlign = 'center';
    bgContext.textBaseline = 'middle';
    const x = bgCanvas.width / (2 * dpr);
    const y = bgCanvas.height / (2 * dpr);
    bgContext.fillText(keywords[currentKeywordIndex], x, y);
    let imageData = bgContext.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    const canvasSize = bgCanvas.width * bgCanvas.height;
    const adjustedDenseness = Math.max(4, Math.min(10, Math.sqrt(canvasSize) / 150));

    for (let height = 0; height < bgCanvas.height; height += adjustedDenseness) {
      for (let width = 0; width < bgCanvas.width; width += adjustedDenseness) {
        const index = (width + (height * bgCanvas.width)) * 4;
        if (imageData.data[index] > 200) {
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
    const colors = ['#c5203e', '#ffffff', '#f7df1e', '#61dafb', '#0070f3' ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 1.5 + Math.random() * 2.5;
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
        part.x2 += part.v.x * 0.8;
        part.y2 += part.v.y * 0.8;
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
            part.x2 += repelX * 2;
            part.y2 += repelY * 2;
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
      const particleSize = part.size || 2;
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
    mouse.x = (e.clientX - rect.left);
    mouse.y = (e.clientY - rect.top);
  };

  const TouchMove = function(e) {
    e.preventDefault();
    mouseOnScreen = true;
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.touches[0].clientX - rect.left);
      mouse.y = (e.touches[0].clientY - rect.top);
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

// --- ETL Animation ---
function setupETLAnimation() {
  const extractEl = document.querySelector('.extract');
  const transformEl = document.querySelector('.transform');
  const loadEl = document.querySelector('.load');
  if (!extractEl || !transformEl || !loadEl) return;

  anime({
    targets: '.transform i',
    rotate: '360deg',
    duration: 8000,
    loop: true,
    easing: 'linear'
  });
}

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', function () {
  
  // Initialize ETL Animation if present
  if (document.getElementById('data-engineering')) {
    setupETLAnimation();
  }

  // --- Frontend Canvas Animation ---
  let bannerInstance;

  function initFrontendCanvasAnimation() {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return;

    bannerInstance = new Banner();
    bannerInstance.initialize('canvas');
  }

  function setupFrontendCanvasObserver() {
    if (!bannerInstance) return;

    const bannerSection = document.getElementById('frontend-animation');
    if (!bannerSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          bannerInstance.startAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(bannerSection);
  }

  // Initialize Frontend Canvas Animation
  initFrontendCanvasAnimation();
  setupFrontendCanvasObserver();
});