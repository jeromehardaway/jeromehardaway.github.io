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


document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'f0beccd7adbad08bd787807f9401a36d'
    const city = 'Atlanta'; // You can change this to any city you want
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherContainer = document.getElementById('weather');
                weatherContainer.innerHTML = `
                    <p>${data.name}: ${data.main.temp}°C, ${data.weather[0].description}</p>
                `;
            } else {
                console.error('Error fetching the weather data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
});
