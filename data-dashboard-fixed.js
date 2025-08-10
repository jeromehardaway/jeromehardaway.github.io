/**
 * Live Data Dashboard
 * Demonstrates data visualization and analytics capabilities
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Content Loaded - Initializing dashboard");
  initializeDataDashboard();
  animateCompactETL();
});

function animateCompactETL() {
  // Animate the compact ETL diagram in the about section
  anime.timeline({
    easing: 'easeOutQuad'
  }).add({
    targets: '.stage-compact',
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.8, 1],
    delay: anime.stagger(200),
    duration: 800
  }).add({
    targets: '.connector-compact',
    opacity: [0, 1],
    scaleX: [0, 1],
    duration: 600
  }, '-=400');
}

// Generate mock data for testing when API calls fail
function generateMockData(endpoint) {
  console.log(`Generating mock data for endpoint: ${endpoint}`);
  
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa'
  ];
  
  let mockData = [];
  const currentYear = new Date().getFullYear() - 1; // Use previous year
  
  switch(endpoint) {
    case 'population':
      states.forEach(state => {
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear,
          "Year": currentYear.toString(),
          "Population": Math.round(100000 + Math.random() * 900000),
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
      });
      break;
    
    case 'income':
      states.forEach(state => {
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear,
          "Year": currentYear.toString(),
          "Household Income": Math.round(40000 + Math.random() * 60000),
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
      });
      break;
    
    case 'education':
      states.forEach(state => {
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear,
          "Year": currentYear.toString(),
          "Bachelor's Degree or Higher": Math.round(20 + Math.random() * 40),
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
      });
      break;
    
    default:
      // Fallback data
      mockData = states.map(state => ({
        "ID State": state,
        "State": state,
        "ID Year": currentYear,
        "Year": currentYear.toString(),
        "Value": Math.round(Math.random() * 1000),
        "Slug State": state.toLowerCase().replace(/ /g, '-')
      }));
  }
  
  return mockData;
}

function updatePipelineStatus(elementId, status) {
  const statusElement = document.getElementById(elementId);
  if (!statusElement) return;
  
  const statusText = statusElement.querySelector('.step-status');
  if (!statusText) return;
  
  statusText.textContent = status;
  
  // Remove any existing status classes
  statusElement.classList.remove('pending', 'processing', 'complete', 'error');
  
  // Add appropriate class
  switch(status.toLowerCase()) {
    case 'pending':
      statusElement.classList.add('pending');
      break;
    case 'processing':
      statusElement.classList.add('processing');
      break;
    case 'complete':
      statusElement.classList.add('complete');
      break;
    case 'error':
      statusElement.classList.add('error');
      break;
  }
}

function initializeDataDashboard() {
  console.log("Initializing data dashboard");
  
  // Add event listener to the process data button
  const processButton = document.getElementById('process-data-btn');
  if (processButton) {
    processButton.addEventListener('click', processData);
  }
  
  // Reset pipeline status
  updatePipelineStatus('extraction-step', 'Pending');
  updatePipelineStatus('transform-step', 'Pending');
  updatePipelineStatus('analyze-step', 'Pending');
  updatePipelineStatus('visualize-step', 'Pending');
}

function processData() {
  console.log("Processing data");
  
  // Get selected data source and visualization type
  const dataSource = document.getElementById('data-source').value;
  const visualizationType = document.getElementById('visualization-type').value;
  
  // Reset metrics
  document.getElementById('processed-records').textContent = '0';
  document.getElementById('processing-time').textContent = '0';
  document.getElementById('accuracy-score').textContent = '0';
  document.getElementById('anomalies-detected').textContent = '0';
  
  // Start data processing pipeline
  simulateDataPipeline(dataSource, visualizationType);
}

function simulateDataPipeline(dataSource, visualizationType) {
  console.log(`Starting data pipeline: ${dataSource} - ${visualizationType}`);
  
  // Clear existing chart and insights
  const chartElement = document.getElementById('main-chart');
  const insightsElement = document.getElementById('insights-content');
  
  if (chartElement) {
    chartElement.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Processing data...</p>
      </div>
    `;
  }
  
  if (insightsElement) {
    insightsElement.innerHTML = `<p>Generating insights...</p>`;
  }
  
  // Reset pipeline status
  updatePipelineStatus('extraction-step', 'Pending');
  updatePipelineStatus('transform-step', 'Pending');
  updatePipelineStatus('analyze-step', 'Pending');
  updatePipelineStatus('visualize-step', 'Pending');
  
  // Step 1: Extract data
  updatePipelineStatus('extraction-step', 'Processing');
  
  // Determine API endpoint based on data source
  let endpoint;
  switch(dataSource) {
    case 'realtime':
      endpoint = 'population';
      break;
    case 'historical':
      endpoint = 'income';
      break;
    case 'anomaly':
      endpoint = 'education';
      break;
    default:
      endpoint = 'population';
  }
  
  // Simulate data extraction (with random failure chance)
  setTimeout(() => {
    // Extract data - simulated API call
    try {
      // Generate mock data (would be an API call in production)
      const extractedData = generateMockData(endpoint);
      
      // Update metrics
      document.getElementById('processed-records').textContent = extractedData.length;
      
      // Update status
      updatePipelineStatus('extraction-step', 'Complete');
      
      // Move to next step
      transformData(extractedData, dataSource, visualizationType);
    } catch (error) {
      console.error("Error extracting data:", error);
      updatePipelineStatus('extraction-step', 'Error');
      
      if (chartElement) {
        chartElement.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error extracting data: ${error.message}</p>
          </div>
        `;
      }
    }
  }, 1000); // Simulate 1 second for extraction
}

function transformData(data, dataSource, visualizationType) {
  console.log("Transforming data:", data.length, "records");
  updatePipelineStatus('transform-step', 'Processing');
  
  // Simulate data transformation process
  setTimeout(() => {
    try {
      // Apply simulated transformations
      let transformedData = data.map(item => {
        // Extract the main value based on data source
        let value;
        switch(dataSource) {
          case 'realtime':
            value = item["Population"];
            break;
          case 'historical':
            value = item["Household Income"];
            break;
          case 'anomaly':
            value = item["Bachelor's Degree or Higher"];
            break;
          default:
            value = item["Value"];
        }
        
        return {
          state: item["State"],
          year: item["Year"],
          value: value,
          // Add some random metrics for demonstration
          growth: parseFloat((Math.random() * 20 - 10).toFixed(2)),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        };
      });
      
      // Update metrics
      document.getElementById('processing-time').textContent = 
        (1 + Math.random() * 0.5).toFixed(2);
      
      // Update status
      updatePipelineStatus('transform-step', 'Complete');
      
      // Move to next step
      analyzeData(transformedData, dataSource, visualizationType);
    } catch (error) {
      console.error("Error transforming data:", error);
      updatePipelineStatus('transform-step', 'Error');
    }
  }, 1500); // Simulate 1.5 seconds for transformation
}

function analyzeData(data, dataSource, visualizationType) {
  console.log("Analyzing data:", data.length, "records");
  updatePipelineStatus('analyze-step', 'Processing');
  
  // Simulate data analysis
  setTimeout(() => {
    try {
      // Perform simulated analysis based on visualization type
      let analysisResult = {
        source: 'Data USA API (simulated)',
        type: visualizationType,
        data: {}
      };
      
      switch(visualizationType) {
        case 'timeseries':
          // Create time series data
          analysisResult.data.timeSeries = {
            labels: data.map(d => d.state).slice(0, 12),
            values: data.map(d => d.value).slice(0, 12)
          };
          break;
          
        case 'distribution':
          // Create distribution data
          let values = data.map(d => d.value).filter(v => v !== undefined && v !== null);
          
          // Ensure we have valid values
          if (values.length === 0) {
            console.error("No valid values found for distribution");
            values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]; // Fallback values
          }
          
          let min = Math.min(...values);
          let max = Math.max(...values);
          let range = max - min;
          
          // Ensure we have a valid range
          if (range === 0) {
            // Add a small value to prevent division by zero
            range = 1;
            max = min + 1;
          }
          
          let bins = [];
          let frequencies = [];
          
          // Create 10 bins
          for (let i = 0; i < 10; i++) {
            const binStart = min + (range / 10) * i;
            bins.push(Math.round(binStart));
            
            // Count values in this bin
            const binEnd = min + (range / 10) * (i + 1);
            const count = values.filter(v => v >= binStart && v < binEnd).length;
            frequencies.push(count);
          }
          
          // Ensure we have at least some frequency data
          if (frequencies.every(f => f === 0)) {
            frequencies = frequencies.map((_, i) => 5 + Math.floor(Math.random() * 10)); // Generate some mock frequencies
          }
          
          analysisResult.data.distribution = {
            bins,
            frequencies,
            mean: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            median: values.length > 0 ? values.sort((a, b) => a - b)[Math.floor(values.length / 2)] : 0
          };
          break;
          
        case 'correlation':
          // Create correlation matrix
          // For demo, we'll create a random 5x5 correlation matrix
          const variables = ['Value', 'Growth', 'Population', 'Income', 'Education'];
          const matrix = [];
          
          for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
              if (i === j) {
                row.push(1); // Diagonal is always 1 (perfect correlation)
              } else if (matrix[j] && matrix[j][i] !== undefined) {
                row.push(matrix[j][i]); // Symmetric matrix
              } else {
                // Random correlation between -1 and 1
                row.push(parseFloat((Math.random() * 2 - 1).toFixed(2)));
              }
            }
            matrix.push(row);
          }
          
          analysisResult.data.correlation = {
            variables,
            matrix
          };
          break;
      }
      
      // Update metrics based on analysis
      document.getElementById('accuracy-score').textContent = 
        (0.85 + Math.random() * 0.1).toFixed(2);
      document.getElementById('anomalies-detected').textContent = 
        Math.floor(Math.random() * 5);
      
      // Update status
      updatePipelineStatus('analyze-step', 'Complete');
      
      // Move to visualization step
      visualizeData(analysisResult, dataSource, visualizationType);
    } catch (error) {
      console.error("Error analyzing data:", error);
      updatePipelineStatus('analyze-step', 'Error');
    }
  }, 2000); // Simulate 2 seconds for analysis
}

function visualizeData(apiResult, dataSource, visualizationType) {
  console.log("Visualizing data:", visualizationType);
  updatePipelineStatus('visualize-step', 'Processing');
  
  // Get the chart element
  const chartElement = document.getElementById('main-chart');
  if (!chartElement) {
    console.error("Chart element not found");
    return;
  }
  
  setTimeout(() => {
    try {
      // Check if we're using mock data
      const mockDataBadge = '<span class="mock-data-badge">Mock Data</span>';
      
      // Create visualization container
      chartElement.innerHTML = `
    <div class="visualization-container">
      <div class="chart-header">
        <h3>${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)} Visualization</h3>
        <span class="data-source-label">${dataSource} data ${mockDataBadge}</span>
        <span class="data-source-info">Source: ${apiResult?.source || 'Data USA'}</span>
      </div>
      <div class="chart-area">
        <div id="anime-visualization" class="anime-visualization"></div>
      </div>
    </div>
  `;
  
      // Verify the visualization container was created
      const visContainer = document.getElementById('anime-visualization');
      if (!visContainer) {
        throw new Error("Visualization container could not be created");
      }
  
      // Create appropriate visualization using anime.js
      console.log("Creating visualization type:", visualizationType);
      
      if (visualizationType === 'timeseries') {
        createTimeSeriesAnime(apiResult);
      } else if (visualizationType === 'distribution') {
        createDistributionAnime(apiResult);
      } else if (visualizationType === 'correlation') {
        createCorrelationAnime(apiResult);
      } else {
        throw new Error("Unknown visualization type: " + visualizationType);
      }
  
  // Update insights
  console.log("Updating insights section");
  updateInsights(dataSource, visualizationType, apiResult);
      
      // Update status
      updatePipelineStatus('visualize-step', 'Complete');
    } catch (error) {
      console.error("Error visualizing data:", error);
      updatePipelineStatus('visualize-step', 'Error');
      
      chartElement.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error visualizing data: ${error.message}</p>
        </div>
      `;
    }
  }, 1000); // Simulate 1 second for visualization
}

function createTimeSeriesAnime(apiResult) {
  try {
    const container = document.getElementById('anime-visualization');
    if (!container) {
      console.error("anime-visualization container not found in the DOM");
      return;
    }
    
    // Use our anime.js visualization module
    if (window.dataViz && typeof window.dataViz.createTimeSeriesChart === 'function') {
      window.dataViz.createTimeSeriesChart(apiResult, container);
    } else {
      console.error("dataViz.createTimeSeriesChart is not available");
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Visualization module not loaded correctly.</div>';
    }
  } catch (error) {
    console.error("Error in createTimeSeriesAnime:", error);
    const container = document.getElementById('main-chart');
    if (container) {
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Error creating visualization: ' + error.message + '</div>';
    }
  }
}

function createDistributionAnime(apiResult) {
  try {
    const container = document.getElementById('anime-visualization');
    if (!container) {
      console.error("anime-visualization container not found in the DOM");
      return;
    }
    
    // Use our anime.js visualization module
    if (window.dataViz && typeof window.dataViz.createDistributionChart === 'function') {
      window.dataViz.createDistributionChart(apiResult, container);
    } else {
      console.error("dataViz.createDistributionChart is not available");
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Visualization module not loaded correctly.</div>';
    }
  } catch (error) {
    console.error("Error in createDistributionAnime:", error);
    const container = document.getElementById('main-chart');
    if (container) {
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Error creating visualization: ' + error.message + '</div>';
    }
  }
}

function createCorrelationAnime(apiResult) {
  try {
    const container = document.getElementById('anime-visualization');
    if (!container) {
      console.error("anime-visualization container not found in the DOM");
      return;
    }
    
    // Use our anime.js visualization module
    if (window.dataViz && typeof window.dataViz.createCorrelationMatrix === 'function') {
      window.dataViz.createCorrelationMatrix(apiResult, container);
    } else {
      console.error("dataViz.createCorrelationMatrix is not available");
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Visualization module not loaded correctly.</div>';
    }
  } catch (error) {
    console.error("Error in createCorrelationAnime:", error);
    const container = document.getElementById('main-chart');
    if (container) {
      container.innerHTML = '<div style="color:#c5203e; padding:20px; text-align:center;">Error creating visualization: ' + error.message + '</div>';
    }
  }
}

function updateInsights(dataSource, visualizationType, apiResult) {
  const insightsElement = document.getElementById('insights-content');
  if (!insightsElement) return;
  
  // Generate insights based on data source and visualization type
  let insights = '';
  
  switch(dataSource) {
    case 'realtime':
      insights = generatePopulationInsights(visualizationType, apiResult);
      break;
    case 'historical':
      insights = generateIncomeInsights(visualizationType, apiResult);
      break;
    case 'anomaly':
      insights = generateEducationInsights(visualizationType, apiResult);
      break;
    default:
      insights = `<p>No insights available for the selected data.</p>`;
  }
  
  insightsElement.innerHTML = insights;
  
  // Animate insights appearance
  anime({
    targets: '#insights-content > *',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(100),
    duration: 800,
    easing: 'easeOutQuad'
  });
}

function generatePopulationInsights(visualizationType, apiResult) {
  return `
    <ul class="insights-list">
      <li><strong>Insight:</strong> Population data shows significant regional variations</li>
      <li><strong>Insight:</strong> Coastal states generally show higher population density</li>
      <li><strong>Insight:</strong> 3 states account for over 25% of the total US population</li>
    </ul>
    <div class="insights-summary">
      <p>The population visualization demonstrates the <span class="insight-highlight">demographic distribution across states</span>, which can be useful for resource allocation and policy planning.</p>
    </div>
  `;
}

function generateIncomeInsights(visualizationType, apiResult) {
  return `
    <ul class="insights-list">
      <li><strong>Insight:</strong> Income distribution follows a standard bell curve</li>
      <li><strong>Insight:</strong> The median household income is approximately $58,000</li>
      <li><strong>Insight:</strong> There's a strong correlation between education level and income</li>
    </ul>
    <div class="insights-summary">
      <p>Income data analysis reveals <span class="insight-highlight">economic patterns</span> that can inform business decisions and market targeting strategies.</p>
    </div>
  `;
}

function generateEducationInsights(visualizationType, apiResult) {
  return `
    <ul class="insights-list">
      <li><strong>Insight:</strong> Education levels have steadily increased over the past decade</li>
      <li><strong>Insight:</strong> Higher education rates correlate with lower unemployment</li>
      <li><strong>Insight:</strong> Regional disparities in education access remain significant</li>
    </ul>
    <div class="insights-summary">
      <p>Education metrics highlight <span class="insight-highlight">developmental opportunities</span> and can guide investment in workforce training programs.</p>
    </div>
  `;
}
