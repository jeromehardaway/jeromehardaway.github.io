/**
 * GitHub Pages Helper
 * This script detects if the site is running on GitHub Pages and adjusts API calls accordingly
 */

document.addEventListener('DOMContentLoaded', () => {
    detectGitHubPages();
});

// Detect if the site is running on GitHub Pages
function detectGitHubPages() {
    const hostname = window.location.hostname;
    const isGitHubPages = 
        hostname.endsWith('github.io') || 
        hostname.endsWith('githubusercontent.com') ||
        hostname.includes('github');
    
    console.log(`Running on GitHub Pages: ${isGitHubPages}`);
    
    if (isGitHubPages) {
        // Add a notice to the dashboard section
        const dashboardSection = document.getElementById('data-dashboard');
        if (dashboardSection) {
            const notice = document.createElement('div');
            notice.className = 'github-pages-notice';
            notice.innerHTML = `
                <div class="container">
                    <p><strong>GitHub Pages Notice:</strong> You're viewing this site on GitHub Pages. 
                    Due to cross-origin restrictions, real API data might not load. 
                    The dashboard will fall back to mock data if the API calls fail.</p>
                    <p>For the best experience with real data, clone the repository and run it locally.</p>
                </div>
            `;
            
            // Add some basic styling
            notice.style.backgroundColor = '#fff3cd';
            notice.style.color = '#856404';
            notice.style.padding = '0.75rem 0';
            notice.style.marginTop = '-4rem';
            notice.style.marginBottom = '2rem';
            notice.style.fontSize = '0.9rem';
            notice.style.textAlign = 'center';
            notice.style.borderBottom = '1px solid #ffeeba';
            
            // Insert at the beginning of the dashboard section
            dashboardSection.insertBefore(notice, dashboardSection.firstChild);
        }
        
        // Modify fetch behavior to improve GitHub Pages compatibility
        enhanceFetchForGitHubPages();
    }
}

// Enhance fetch API to work better on GitHub Pages
function enhanceFetchForGitHubPages() {
    // Store original fetch
    const originalFetch = window.fetch;
    
    // Override fetch
    window.fetch = async function(resource, options) {
        try {
            // First try the original fetch
            return await originalFetch(resource, options);
        } catch (error) {
            console.warn('Original fetch failed:', error);
            
            // If it's a CORS issue and it's an API call, try with JSONP approach
            if (resource.toString().includes('datausa.io')) {
                console.log('Attempting alternative fetch for Data USA API');
                
                // For GitHub Pages, we'll use a more reliable public CORS proxy
                // This is a fallback for demonstration purposes only
                const altProxies = [
                    'https://api.allorigins.win/raw?url=',
                    'https://api.codetabs.com/v1/proxy?quest='
                ];
                
                for (const proxy of altProxies) {
                    try {
                        const url = typeof resource === 'string' ? resource : resource.url;
                        const proxiedUrl = proxy + encodeURIComponent(url);
                        
                        console.log(`Trying alternative proxy: ${proxy}`);
                        const response = await originalFetch(proxiedUrl, options);
                        
                        if (response.ok) {
                            console.log('Alternative proxy succeeded');
                            return response;
                        }
                    } catch (proxyError) {
                        console.warn(`Alternative proxy failed:`, proxyError);
                    }
                }
            }
            
            // If all else fails, rethrow the original error
            throw error;
        }
    };
    
    console.log('Enhanced fetch API for GitHub Pages compatibility');
}

// Add dark mode support for the GitHub Pages notice
document.addEventListener('DOMContentLoaded', () => {
    // Check for dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            setTimeout(() => {
                const notice = document.querySelector('.github-pages-notice');
                if (notice) {
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    if (isDarkMode) {
                        notice.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
                        notice.style.color = '#e0e0e0';
                        notice.style.borderColor = 'rgba(255, 193, 7, 0.2)';
                    } else {
                        notice.style.backgroundColor = '#fff3cd';
                        notice.style.color = '#856404';
                        notice.style.borderColor = '#ffeeba';
                    }
                }
            }, 100);
        });
    }
});
