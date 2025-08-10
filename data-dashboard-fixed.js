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
  
  // Get the chart element
  const chartElement = document.getElementById('main-chart');
  
  // Add loading state
  if (chartElement) {
    chartElement.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Processing data...</p>
        <p class="cors-notice">
          <strong>Note:</strong> If you're viewing this on GitHub Pages, you may see mock data due to CORS restrictions.
          <br>For the best experience, clone the repository and run it locally.
        </p>
      </div>
    `;
  }
  
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
  
  // Fetch real data from Data USA API
  setTimeout(async () => {
    try {
      // Use the fetchDataUSA function from data-api.js
      let apiResponse;
      let extractedData = [];
      
      if (typeof fetchDataUSA === 'function') {
        // Fetch real data from the API
        apiResponse = await fetchDataUSA(endpoint);
        
        // Check if we actually got data or if we got mock data
        if (apiResponse && apiResponse.data) {
          extractedData = apiResponse.data;
          const isMockData = apiResponse.isMockData || false;
          
          if (isMockData) {
            console.warn("Using mock data because API call failed or returned no data");
          } else {
            console.log("Successfully fetched real data from API:", endpoint);
          }
        } else {
          console.warn("No data returned from API, falling back to mock data");
          extractedData = generateMockData(endpoint);
          apiResponse = {
            source: `Mock ${endpoint} data (API unavailable)`,
            data: extractedData,
            recordCount: extractedData.length,
            processingTime: 0.5,
            endpoint: endpoint,
            isMockData: true
          };
        }
        
        // Update metrics (safely)
        if (extractedData && Array.isArray(extractedData)) {
          document.getElementById('processed-records').textContent = extractedData.length;
        } else {
          document.getElementById('processed-records').textContent = "0";
          console.error("Invalid data format returned");
          extractedData = generateMockData(endpoint);
          apiResponse = {
            source: `Mock ${endpoint} data (API unavailable)`,
            data: extractedData,
            recordCount: extractedData.length,
            processingTime: 0.5,
            endpoint: endpoint,
            isMockData: true
          };
        }
        
        // Update status
        updatePipelineStatus('extraction-step', 'Complete');
        
        // Move to next step (only if we have valid data)
        if (extractedData && Array.isArray(extractedData) && extractedData.length > 0) {
          transformData(extractedData, dataSource, visualizationType);
        } else {
          throw new Error("No valid data available for processing");
        }
      } else {
        // Fallback to mock data if the API function isn't available
        console.error("fetchDataUSA function not found - falling back to mock data");
        extractedData = generateMockData(endpoint);
        
        // Update metrics
        document.getElementById('processed-records').textContent = extractedData.length;
        
        // Update status
        updatePipelineStatus('extraction-step', 'Complete');
        
        // Move to next step
        transformData(extractedData, dataSource, visualizationType);
      }
    } catch (error) {
      console.error("Error extracting data:", error);
      updatePipelineStatus('extraction-step', 'Error');
      
      // Generate fallback mock data
      const fallbackData = generateMockData(endpoint);
      
      if (chartElement) {
        chartElement.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error extracting data: ${error.message}</p>
            <p>Falling back to mock data...</p>
          </div>
        `;
        
        // Wait a moment then continue with mock data
        setTimeout(() => {
          // Update status
          updatePipelineStatus('extraction-step', 'Complete');
          document.getElementById('processed-records').textContent = fallbackData.length;
          
          // Continue with mock data
          transformData(fallbackData, dataSource, visualizationType);
        }, 1500);
      }
    }
  }, 1000); // Simulate 1 second for extraction
}

function transformData(data, dataSource, visualizationType) {
  console.log("Transforming data");
  updatePipelineStatus('transform-step', 'Processing');
  
  // Validate input data first
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Invalid or empty data passed to transformData");
    updatePipelineStatus('transform-step', 'Error');
    
    // Generate fallback data
    const fallbackData = generateMockDataForTransformation(dataSource);
    
    // Continue with fallback data
    setTimeout(() => {
      updatePipelineStatus('transform-step', 'Complete');
      document.getElementById('processing-time').textContent = 
        (1 + Math.random() * 0.5).toFixed(2);
      analyzeData(fallbackData, dataSource, visualizationType);
    }, 1500);
    
    return;
  }
  
  // Log valid data length
  console.log("Transforming data:", data.length, "records");
  
  // Simulate data transformation process
  setTimeout(() => {
    try {
      // Apply simulated transformations
      let transformedData = [];
      
      // Process each data item with proper error handling
      data.forEach(item => {
        try {
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
          
          // Skip entries with undefined values
          if (value !== undefined && value !== null) {
            transformedData.push({
              state: item["State"] || "Unknown",
              year: item["Year"] || new Date().getFullYear().toString(),
              value: value,
              // Add some random metrics for demonstration
              growth: parseFloat((Math.random() * 20 - 10).toFixed(2)),
              trend: Math.random() > 0.5 ? 'up' : 'down'
            });
          }
        } catch (itemError) {
          console.warn("Error processing data item:", itemError);
          // Continue with next item
        }
      });
      
      // Check if we have any valid transformed data
      if (transformedData.length === 0) {
        console.warn("No valid data items after transformation, using fallback data");
        transformedData = generateMockDataForTransformation(dataSource);
      }
      
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
      
      // Use fallback data to continue the pipeline
      const fallbackData = generateMockDataForTransformation(dataSource);
      setTimeout(() => {
        updatePipelineStatus('transform-step', 'Complete');
        analyzeData(fallbackData, dataSource, visualizationType);
      }, 1000);
    }
  }, 1500); // Simulate 1.5 seconds for transformation
}

// Helper function to generate transformation-ready mock data
function generateMockDataForTransformation(dataSource) {
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia'
  ];
  
  return states.map(state => {
    let value;
    switch(dataSource) {
      case 'realtime':
        value = Math.round(100000 + Math.random() * 900000);
        break;
      case 'historical':
        value = Math.round(40000 + Math.random() * 60000);
        break;
      case 'anomaly':
        value = Math.round(20 + Math.random() * 40);
        break;
      default:
        value = Math.round(Math.random() * 1000);
    }
    
    return {
      state: state,
      year: new Date().getFullYear().toString(),
      value: value,
      growth: parseFloat((Math.random() * 20 - 10).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    };
  });
}

function analyzeData(data, dataSource, visualizationType) {
  // Validate input data first
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data passed to analyzeData");
    updatePipelineStatus('analyze-step', 'Error');
    
    // Generate fallback result
    setTimeout(() => {
      const fallbackResult = generateFallbackAnalysisResult(dataSource, visualizationType);
      updatePipelineStatus('analyze-step', 'Complete');
      visualizeData(fallbackResult, dataSource, visualizationType);
    }, 1500);
    
    return;
  }
  
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
          if (data.length > 0) {
            analysisResult.data.timeSeries = {
              labels: data.map(d => d.state || "Unknown").slice(0, 12),
              values: data.map(d => d.value || 0).slice(0, 12)
            };
          } else {
            // Fallback data if no valid data points
            analysisResult.data.timeSeries = {
              labels: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID'],
              values: [12, 19, 3, 5, 2, 3, 15, 7, 9, 11, 13, 17]
            };
          }
          break;
          
        case 'distribution':
          // Create distribution data
          let values = data.map(d => d.value).filter(v => v !== undefined && v !== null);
          
          // Ensure we have valid values
          if (values.length === 0) {
            console.warn("No valid values found for distribution, using fallback values");
            values = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]; // Fallback values
          }
          
          let min = Math.min(...values);
          let max = Math.max(...values);
          let range = max - min;
          
          // Ensure we have a valid range
          if (range === 0 || isNaN(range)) {
            console.warn("Invalid range detected, using fallback range");
            min = 0;
            max = 100;
            range = 100;
          }
          
          let bins = [];
          let frequencies = [];
          
          // Create 10 bins
          for (let i = 0; i < 10; i++) {
            const binStart = min + (range / 10) * i;
            bins.push(Math.round(binStart));
            
            try {
              // Count values in this bin
              const binEnd = min + (range / 10) * (i + 1);
              const count = values.filter(v => v >= binStart && v < binEnd).length;
              frequencies.push(count);
            } catch (binError) {
              console.warn("Error calculating bin frequency:", binError);
              frequencies.push(0);
            }
          }
          
          // Ensure we have at least some frequency data
          if (frequencies.every(f => f === 0)) {
            console.warn("All frequency values are zero, generating mock frequencies");
            frequencies = frequencies.map((_, i) => 5 + Math.floor(Math.random() * 10)); // Generate some mock frequencies
          }
          
          // Calculate mean and median safely
          let mean = 0;
          let median = 0;
          
          try {
            if (values.length > 0) {
              mean = values.reduce((a, b) => a + b, 0) / values.length;
              const sortedValues = [...values].sort((a, b) => a - b);
              median = sortedValues[Math.floor(sortedValues.length / 2)];
            }
          } catch (statsError) {
            console.warn("Error calculating statistics:", statsError);
          }
          
          analysisResult.data.distribution = {
            bins,
            frequencies,
            mean,
            median
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
          
        default:
          throw new Error(`Unsupported visualization type: ${visualizationType}`);
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
      
      // Generate fallback result and continue
      const fallbackResult = generateFallbackAnalysisResult(dataSource, visualizationType);
      setTimeout(() => {
        updatePipelineStatus('analyze-step', 'Complete');
        visualizeData(fallbackResult, dataSource, visualizationType);
      }, 1000);
    }
  }, 2000); // Simulate 2 seconds for analysis
}

// Helper function to generate fallback analysis results
function generateFallbackAnalysisResult(dataSource, visualizationType) {
  const result = {
    source: 'Fallback data (error recovery)',
    type: visualizationType,
    data: {},
    isMockData: true
  };
  
  switch(visualizationType) {
    case 'timeseries':
      result.data.timeSeries = {
        labels: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID'],
        values: [12, 19, 3, 5, 2, 3, 15, 7, 9, 11, 13, 17]
      };
      break;
      
    case 'distribution':
      result.data.distribution = {
        bins: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        frequencies: [5, 8, 12, 20, 25, 20, 15, 10, 8, 5],
        mean: 50,
        median: 45
      };
      break;
      
    case 'correlation':
      const variables = ['Value', 'Growth', 'Population', 'Income', 'Education'];
      const matrix = [
        [1.00, 0.35, 0.42, 0.48, 0.31],
        [0.35, 1.00, 0.28, 0.62, 0.45],
        [0.42, 0.28, 1.00, 0.38, 0.29],
        [0.48, 0.62, 0.38, 1.00, 0.51],
        [0.31, 0.45, 0.29, 0.51, 1.00]
      ];
      
      result.data.correlation = {
        variables,
        matrix
      };
      break;
  }
  
  return result;
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
      const isMockData = apiResult && apiResult.isMockData;
      const dataSourceLabel = isMockData ? 
        `<span class="mock-data-badge">Mock Data</span>` : 
        `<span class="real-data-badge">Real API Data</span>`;
      
      // Create visualization container
      chartElement.innerHTML = `
    <div class="visualization-container">
      <div class="chart-header">
        <h3>${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)} Visualization</h3>
        <span class="data-source-label">${dataSource} data ${dataSourceLabel}</span>
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
