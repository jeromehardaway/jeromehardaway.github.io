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