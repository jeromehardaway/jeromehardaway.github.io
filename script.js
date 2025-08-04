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
  
  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      // Toggle dark mode class
      document.body.classList.toggle('dark-mode');
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      
      // Announce to screen readers
      const isDarkMode = document.body.classList.contains('dark-mode');
      const message = isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('sr-only');
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      // Remove announcement after it's read
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
    
    // Check for system preference if no saved preference
    if (localStorage.getItem('darkMode') === null) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      }
    }
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
          if (e.matches) {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }
        }
      });
    }
  }
  
  // Mobile navigation
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      hamburgerMenu.classList.toggle('active');
    });
  }
});