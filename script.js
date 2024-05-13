function toggleDarkMode() {
  const elements = document.querySelectorAll('body, header, nav');
  elements.forEach(el => {
      el.classList.toggle('dark-mode');
  });

  // Save the current mode to localStorage
  if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
  } else {
      localStorage.setItem('darkMode', 'disabled');
  }
}

// Event listener for the dark mode toggle button
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Check localStorage for dark mode preference and apply it
window.onload = function() {
  if (localStorage.getItem('darkMode') === 'enabled') {
      const elements = document.querySelectorAll('body, header, nav');
      elements.forEach(el => {
          el.classList.add('dark-mode');
      });
  }
};
