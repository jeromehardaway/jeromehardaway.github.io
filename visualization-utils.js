// Error handling utility for data visualizations
// This script provides robust error handling for anime.js visualizations

// Safe element creation utility
function safeCreateElement(parentElement, tagName, className = null, id = null) {
    try {
        if (!parentElement || !parentElement.appendChild) {
            console.error("Parent element is not a valid DOM node");
            return null;
        }
        
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (id) element.id = id;
        parentElement.appendChild(element);
        return element;
    } catch (error) {
        console.error(`Error creating ${tagName} element:`, error);
        return null;
    }
}

// Safe element finder
function safeQuerySelector(parent, selector) {
    try {
        if (!parent || typeof parent.querySelector !== 'function') {
            console.error("Invalid parent element for querySelector");
            return null;
        }
        return parent.querySelector(selector);
    } catch (error) {
        console.error(`Error with querySelector for ${selector}:`, error);
        return null;
    }
}

// Safe anime animation function
function safeAnimate(targets, animationConfig) {
    try {
        // First check if targets exist in the DOM
        if (!targets) {
            console.warn("Animation targets are undefined or null");
            return null;
        }
        
        // For element selectors, verify they exist before animating
        if (typeof targets === 'string') {
            const elements = document.querySelectorAll(targets);
            if (elements.length === 0) {
                console.warn(`No elements found for selector: ${targets}`);
                return null;
            }
        }
        
        // For array of elements, verify at least one exists
        if (Array.isArray(targets)) {
            const validTargets = targets.filter(t => t && t.nodeType === 1);
            if (validTargets.length === 0) {
                console.warn("No valid DOM elements found in animation targets array");
                return null;
            }
            // Replace targets with only valid ones
            targets = validTargets;
        }
        
        // For single element, verify it's a DOM node
        if (targets.nodeType !== undefined && targets.nodeType !== 1) {
            console.warn("Animation target is not a valid DOM element");
            return null;
        }
        
        // If we made it here, we have valid targets, so animate
        return anime({
            targets: targets,
            ...animationConfig
        });
    } catch (error) {
        console.error("Error in animation:", error);
        return null;
    }
}

// Export utilities to global scope for use in other scripts
window.visualizationUtils = {
    safeCreateElement,
    safeQuerySelector,
    safeAnimate
};

// Add an event listener to patch the distribution visualization specifically
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all visualization code to load
    setTimeout(() => {
        // Fix specific issue with nodeType error
        const processDataBtn = document.getElementById('process-data-btn');
        if (processDataBtn) {
            const originalOnClick = processDataBtn.onclick;
            
            processDataBtn.onclick = function(event) {
                try {
                    // Check if income data and distribution are selected
                    const dataSource = document.getElementById('data-source');
                    const vizType = document.getElementById('visualization-type');
                    
                    if (dataSource && dataSource.value === 'historical' && 
                        vizType && vizType.value === 'distribution') {
                        console.log("Detected income data + distribution combination - applying extra safeguards");
                        
                        // Apply special handling for this case
                        const mainChart = document.getElementById('main-chart');
                        if (mainChart) {
                            // Clear previous content first
                            mainChart.innerHTML = '';
                            
                            // Add a loading indicator
                            const loadingEl = document.createElement('div');
                            loadingEl.className = 'loading-indicator';
                            loadingEl.innerHTML = '<p>Loading visualization...</p>';
                            mainChart.appendChild(loadingEl);
                        }
                    }
                    
                    // Call original click handler
                    if (typeof originalOnClick === 'function') {
                        return originalOnClick.call(this, event);
                    }
                } catch (error) {
                    console.error("Error in patched process data button handler:", error);
                    const mainChart = document.getElementById('main-chart');
                    if (mainChart) {
                        mainChart.innerHTML = `<div class="error-message">Error processing data: ${error.message}</div>`;
                    }
                }
            };
        }
    }, 500); // Short delay to ensure all scripts are loaded
});
