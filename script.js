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
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
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