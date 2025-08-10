// Data Dashboard Visualization Module using anime.js
// Creates interactive and animated data visualizations

// Initialize the dataViz object immediately to ensure it exists
window.dataViz = window.dataViz || {};

// Create time series visualization using anime.js
function createTimeSeriesChart(apiResponse, targetElement) {
    // Ensure the target element exists
    if (!targetElement) {
        console.error("Target element is null or undefined");
        return;
    }
    
    // Clear previous visualization
    targetElement.innerHTML = '';
    
    try {
        // Create visualization container
        const vizContainer = document.createElement('div');
        vizContainer.className = 'anime-visualization';
        targetElement.appendChild(vizContainer);

        // Generate data (either from API or mock data)
        let timeSeriesData;
        if (apiResponse && apiResponse.data && apiResponse.data.timeSeries) {
            timeSeriesData = apiResponse.data.timeSeries;
        } else {
            // Mock data if real data isn't available
            timeSeriesData = generateMockTimeSeriesData();
            
            // Add mock data indicator
            const mockIndicator = document.createElement('div');
            mockIndicator.textContent = '(Using mock data for demonstration)';
            mockIndicator.style.position = 'absolute';
            mockIndicator.style.top = '5px';
            mockIndicator.style.right = '5px';
            mockIndicator.style.fontSize = '11px';
            mockIndicator.style.color = '#c5203e';
            mockIndicator.style.padding = '2px 5px';
            mockIndicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
            mockIndicator.style.borderRadius = '2px';
            vizContainer.appendChild(mockIndicator);
        }
    
    // Calculate max value for scaling
    const maxValue = Math.max(...timeSeriesData.values) * 1.1; // Add 10% padding
    const numPoints = timeSeriesData.values.length;
    
    // Create bars for the time series
    timeSeriesData.values.forEach((value, index) => {
        // Create bar
        const bar = document.createElement('div');
        bar.className = 'time-bar';
        
        // Set initial properties
        bar.style.left = `${(index / numPoints * 100)}%`;
        bar.style.height = '0px'; // Start with 0 height
        bar.style.opacity = '0'; // Start transparent
        vizContainer.appendChild(bar);
        
        // Create label
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = timeSeriesData.labels[index] || `Point ${index + 1}`;
        label.style.left = `${(index / numPoints * 100)}%`;
        vizContainer.appendChild(label);
    });
    
        // Animate the bars using anime.js
        const bars = vizContainer.querySelectorAll('.time-bar');
        
        anime({
            targets: bars,
            height: (el, i) => {
                const value = timeSeriesData.values[i];
                return `${(value / maxValue) * 240}px`; // 240px max height
            },
            opacity: 1,
            delay: anime.stagger(50),
            easing: 'easeOutCubic',
            duration: 1000
        });
    } catch (error) {
        console.error("Error creating time series chart:", error);
        targetElement.innerHTML = `<div style="color:#c5203e; padding:20px; text-align:center;">Error rendering visualization: ${error.message}</div>`;
    }
}

// Create distribution visualization using anime.js
function createDistributionChart(apiResponse, targetElement) {
    // Ensure the target element exists
    if (!targetElement) {
        console.error("Target element is null or undefined");
        return;
    }
    
    // Clear previous visualization
    targetElement.innerHTML = '';
    
    try {
        // Create visualization container
        const vizContainer = document.createElement('div');
        vizContainer.className = 'anime-visualization';
        targetElement.appendChild(vizContainer);    // Generate data (either from API or mock data)
    let distributionData;
    if (apiResponse && apiResponse.data && apiResponse.data.distribution) {
        distributionData = apiResponse.data.distribution;
    } else {
        // Mock data if real data isn't available
        distributionData = generateMockDistributionData();
        
        // Add mock data indicator
        const mockIndicator = document.createElement('div');
        mockIndicator.textContent = '(Using mock data for demonstration)';
        mockIndicator.style.position = 'absolute';
        mockIndicator.style.top = '5px';
        mockIndicator.style.right = '5px';
        mockIndicator.style.fontSize = '11px';
        mockIndicator.style.color = '#c5203e';
        mockIndicator.style.padding = '2px 5px';
        mockIndicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
        mockIndicator.style.borderRadius = '2px';
        vizContainer.appendChild(mockIndicator);
    }
    
    // Calculate max value for scaling
    const maxValue = Math.max(...distributionData.frequencies) * 1.1; // Add 10% padding
    const numBars = distributionData.frequencies.length;
    
    // Create bars for the distribution
    distributionData.frequencies.forEach((value, index) => {
        // Create bar
        const bar = document.createElement('div');
        bar.className = 'dist-bar';
        
        // Set initial properties
        bar.style.left = `${(index / numBars * 90) + 5}%`; // 5% padding on each side
        bar.style.height = '0px'; // Start with 0 height
        bar.style.opacity = '0'; // Start transparent
        vizContainer.appendChild(bar);
        
        // Create label
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = distributionData.bins[index] || `Bin ${index + 1}`;
        label.style.left = `${(index / numBars * 90) + 5}%`;
        vizContainer.appendChild(label);
    });
    
    // Add mean line if available
    if (distributionData.mean !== undefined) {
        const meanLine = document.createElement('div');
        meanLine.style.position = 'absolute';
        meanLine.style.left = `${((distributionData.mean - distributionData.bins[0]) / 
                              (distributionData.bins[distributionData.bins.length - 1] - distributionData.bins[0]) * 90) + 5}%`;
        meanLine.style.width = '2px';
        meanLine.style.height = '240px';
        meanLine.style.bottom = '30px';
        meanLine.style.backgroundColor = '#091f40';
        meanLine.style.opacity = 0;
        
        const meanLabel = document.createElement('div');
        meanLabel.textContent = 'Mean';
        meanLabel.style.position = 'absolute';
        meanLabel.style.top = '-20px';
        meanLabel.style.left = '50%';
        meanLabel.style.transform = 'translateX(-50%)';
        meanLabel.style.fontSize = '10px';
        meanLabel.style.color = '#091f40';
        meanLabel.style.fontWeight = 'bold';
        
        meanLine.appendChild(meanLabel);
        vizContainer.appendChild(meanLine);
    }
    
    // Add median line if available
    if (distributionData.median !== undefined) {
        const medianLine = document.createElement('div');
        medianLine.style.position = 'absolute';
        medianLine.style.left = `${((distributionData.median - distributionData.bins[0]) / 
                                (distributionData.bins[distributionData.bins.length - 1] - distributionData.bins[0]) * 90) + 5}%`;
        medianLine.style.width = '2px';
        medianLine.style.height = '240px';
        medianLine.style.bottom = '30px';
        medianLine.style.backgroundColor = '#c5203e';
        medianLine.style.opacity = 0;
        
        const medianLabel = document.createElement('div');
        medianLabel.textContent = 'Median';
        medianLabel.style.position = 'absolute';
        medianLabel.style.top = '-20px';
        medianLabel.style.left = '50%';
        medianLabel.style.transform = 'translateX(-50%)';
        medianLabel.style.fontSize = '10px';
        medianLabel.style.color = '#c5203e';
        medianLabel.style.fontWeight = 'bold';
        
        medianLine.appendChild(medianLabel);
        vizContainer.appendChild(medianLine);
    }
    
    // Animate the bars using anime.js
    const bars = vizContainer.querySelectorAll('.dist-bar');
    
    anime({
        targets: bars,
        height: (el, i) => {
            const value = distributionData.frequencies[i];
            return `${(value / maxValue) * 240}px`; // 240px max height
        },
        opacity: 1,
        delay: anime.stagger(80),
        easing: 'easeOutElastic(1, .5)',
        duration: 1200
    });
    
    // Animate statistics lines - but only if they exist
    const meanLine = vizContainer.querySelector('div[style*="backgroundColor: #091f40"]');
    const medianLine = vizContainer.querySelector('div[style*="backgroundColor: #c5203e"]');
    
    // Create an array of valid targets (filter out null values)
    const statLines = [meanLine, medianLine].filter(line => line !== null);
    
    // Only run animation if we have valid targets
    if (statLines.length > 0) {
        anime({
            targets: statLines,
            opacity: 1,
            duration: 800,
            delay: 1000
        });
    }
    } catch (error) {
        console.error("Error creating distribution chart:", error);
        targetElement.innerHTML = `<div style="color:#c5203e; padding:20px; text-align:center;">Error rendering visualization: ${error.message}</div>`;
    }
}

// Create correlation matrix visualization using anime.js
function createCorrelationMatrix(apiResponse, targetElement) {
    // Ensure the target element exists
    if (!targetElement) {
        console.error("Target element is null or undefined");
        return;
    }
    
    // Clear previous visualization
    targetElement.innerHTML = '';
    
    try {
        // Create visualization container
        const vizContainer = document.createElement('div');
        vizContainer.className = 'anime-visualization';
        targetElement.appendChild(vizContainer);
        
        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'corr-grid';
        vizContainer.appendChild(gridContainer);    // Generate data (either from API or mock data)
    let correlationData;
    if (apiResponse && apiResponse.data && apiResponse.data.correlation) {
        correlationData = apiResponse.data.correlation;
    } else {
        // Mock data if real data isn't available
        correlationData = generateMockCorrelationData();
        
        // Add mock data indicator
        const mockIndicator = document.createElement('div');
        mockIndicator.textContent = '(Using mock data for demonstration)';
        mockIndicator.style.position = 'absolute';
        mockIndicator.style.top = '5px';
        mockIndicator.style.right = '5px';
        mockIndicator.style.fontSize = '11px';
        mockIndicator.style.color = '#c5203e';
        mockIndicator.style.padding = '2px 5px';
        mockIndicator.style.backgroundColor = 'rgba(255,255,255,0.8)';
        mockIndicator.style.borderRadius = '2px';
        vizContainer.appendChild(mockIndicator);
    }
    
    const variables = correlationData.variables;
    const matrix = correlationData.matrix;
    const numVars = variables.length;
    
    // Function to map correlation value to a color
    function getCorrelationColor(value) {
        // Value ranges from -1 to 1
        if (value > 0) {
            // Positive correlation: blue (low) to navy (high)
            const intensity = Math.min(Math.abs(value) * 255, 255);
            return `rgb(9, ${50 - (intensity * 0.15)}, ${64 + (intensity * 0.7)})`;
        } else {
            // Negative correlation: light red (low) to dark red (high)
            const intensity = Math.min(Math.abs(value) * 255, 255);
            return `rgb(${197 + (intensity * 0.23)}, ${32 + (intensity * 0.05)}, ${62 - (intensity * 0.09)})`;
        }
    }
    
    // Create cells for the correlation matrix
    const cells = [];
    for (let i = 0; i < numVars; i++) {
        for (let j = 0; j < numVars; j++) {
            const cell = document.createElement('div');
            cell.className = 'corr-cell';
            
            // Set position and size
            const cellSize = 100 / numVars;
            cell.style.left = `${j * cellSize}%`;
            cell.style.top = `${i * cellSize}%`;
            cell.style.width = `${cellSize}%`;
            cell.style.height = `${cellSize}%`;
            
            // Set color based on correlation value
            const corrValue = matrix[i][j];
            cell.style.backgroundColor = getCorrelationColor(corrValue);
            cell.style.opacity = 0;
            
            // Add value text if it's not a self-correlation (diagonal)
            if (i !== j) {
                const valueLabel = document.createElement('div');
                valueLabel.className = 'cell-label';
                valueLabel.textContent = corrValue.toFixed(2);
                cell.appendChild(valueLabel);
            } else {
                // For diagonal cells, show the variable name
                cell.style.backgroundColor = '#f8f9fa';
                cell.style.color = '#091f40';
                cell.style.fontWeight = 'bold';
                cell.textContent = variables[i];
            }
            
            gridContainer.appendChild(cell);
            cells.push(cell);
        }
    }
    
        // Animate the cells using anime.js
        anime({
            targets: cells,
            opacity: 1,
            scale: [0.5, 1],
            delay: anime.stagger(30, {grid: [numVars, numVars], from: 'center'}),
            easing: 'easeOutQuad',
            duration: 800
        });
    } catch (error) {
        console.error("Error creating correlation matrix:", error);
        targetElement.innerHTML = `<div style="color:#c5203e; padding:20px; text-align:center;">Error rendering visualization: ${error.message}</div>`;
    }
}

// Mock data generators for demonstration
function generateMockTimeSeriesData() {
    const values = [];
    const labels = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];    // Generate 12 months of data with a trend and some randomness
    for (let i = 0; i < 12; i++) {
        // Base trend that increases over time
        let value = 30 + (i * 5);
        
        // Add some seasonality
        value += 15 * Math.sin(i / 3);
        
        // Add some randomness
        value += Math.random() * 10 - 5;
        
        values.push(Math.max(0, Math.round(value)));
        labels.push(months[i]);
    }
    
    return {
        values,
        labels
    };
}

function generateMockDistributionData() {
    // Create a bell curve-like distribution
    const frequencies = [];
    const bins = [];
    
    // Center of distribution
    const mean = 50;
    const stdDev = 15;
    
    // Generate 15 bins
    for (let i = 0; i < 15; i++) {
        const binCenter = i * 10;
        bins.push(binCenter);
        
        // Calculate normal distribution value
        const exponent = -0.5 * Math.pow((binCenter - mean) / stdDev, 2);
        const frequency = 100 * Math.exp(exponent);
        
        // Add some randomness
        frequencies.push(Math.max(5, Math.round(frequency + (Math.random() * 10 - 5))));
    }
    
    return {
        frequencies,
        bins,
        mean: mean,
        median: mean + (Math.random() * 8 - 4) // Slightly off from mean
    };
}

function generateMockCorrelationData() {
    const variables = ['Revenue', 'Users', 'Sessions', 'Bounce Rate', 'Conv. Rate'];
    const numVars = variables.length;
    
    // Initialize matrix with zeros
    const matrix = Array(numVars).fill().map(() => Array(numVars).fill(0));
    
    // Fill the matrix with correlation values
    for (let i = 0; i < numVars; i++) {
        for (let j = 0; j < numVars; j++) {
            if (i === j) {
                // Diagonal is always 1 (perfect correlation with self)
                matrix[i][j] = 1;
            } else if (j > i) {
                // Generate a random correlation value between -1 and 1
                // But make it more likely to be strongly correlated for demonstration
                let rand = Math.random();
                if (rand > 0.7) {
                    // Strong positive correlation
                    matrix[i][j] = 0.7 + (rand * 0.3);
                } else if (rand < 0.3) {
                    // Strong negative correlation
                    matrix[i][j] = -0.7 - (rand * 0.3);
                } else {
                    // Weak correlation
                    matrix[i][j] = (rand - 0.5) * 1.4;
                }
                
                // Correlation matrix is symmetric
                matrix[j][i] = matrix[i][j];
            }
        }
    }
    
    return {
        variables,
        matrix
    };
}

// Export functions for use in main dashboard code
window.dataViz = window.dataViz || {};
window.dataViz.createTimeSeriesChart = createTimeSeriesChart;
window.dataViz.createDistributionChart = createDistributionChart;
window.dataViz.createCorrelationMatrix = createCorrelationMatrix;

// Log successful initialization
console.log("Anime.js visualizations module loaded successfully");
