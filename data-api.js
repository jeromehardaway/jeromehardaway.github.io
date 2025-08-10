// Data API integration

// Function to fetch data from Data USA API
async function fetchDataUSA(endpoint) {
  try {
    console.log(`Fetching data from Data USA API for endpoint: ${endpoint}`);
    const startTime = performance.now();
    
    // Construct API URL based on endpoint
    let apiUrl;
    let source = '';
    
    switch (endpoint) {
      case 'population':
        // Population data for states
        apiUrl = 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest,latest-5';
        source = 'population';
        break;
      case 'income':
        // Income data for states
        apiUrl = 'https://datausa.io/api/data?drilldowns=State&measures=Household%20Income%20by%20Race,Household%20Income&year=latest,latest-5';
        source = 'income';
        break;
      case 'education':
        // Educational attainment data
        apiUrl = 'https://datausa.io/api/data?drilldowns=State&measures=Educational%20Attainment%20by%20Race%25,Educational%20Attainment%20by%20Sex%25&year=latest,latest-2';
        source = 'education';
        break;
      default:
        // Default to population
        apiUrl = 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest,latest-5';
        source = 'population';
    }
    
    // Add a timestamp to prevent caching
    const cacheBuster = `_t=${Date.now()}`;
    apiUrl += (apiUrl.includes('?') ? '&' : '?') + cacheBuster;
    
    // Use a more reliable CORS proxy to avoid CORS issues
    // These public CORS proxies are for demonstration purposes only
    // In a production environment, you should use your own proxy or APIs that support CORS
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    
    // Try each proxy in order until one works
    let response = null;
    let proxyError = null;
    
    for (const corsProxy of corsProxies) {
      try {
        const proxiedUrl = corsProxy + encodeURIComponent(apiUrl);
        console.log(`Trying CORS proxy: ${corsProxy}`);
        
        // Fetch data from API through the CORS proxy
        response = await fetch(proxiedUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // Needed for some proxies
          },
          timeout: 10000 // 10 second timeout
        });
        
        if (response.ok) {
          console.log(`CORS proxy ${corsProxy} succeeded`);
          break; // Exit the loop if successful
        } else {
          console.warn(`CORS proxy ${corsProxy} returned status: ${response.status}`);
        }
      } catch (err) {
        console.warn(`CORS proxy ${corsProxy} error:`, err);
        proxyError = err;
      }
    }
    
    // If no proxy worked, throw an error
    if (!response || !response.ok) {
      throw new Error(proxyError || `HTTP error! Status: ${response?.status || 'unknown'}`);
    }
    
    const data = await response.json();
    const endTime = performance.now();
    
    console.log(`Received ${data.data?.length || 0} records from Data USA API`);
    
    // Return processed result
    return {
      source: 'Data USA API',
      data: data.data,
      recordCount: data.data?.length || 0,
      processingTime: Math.round((endTime - startTime) / 10) / 100, // Round to 2 decimal places
      endpoint: source,
      isMockData: false
    };
  } catch (error) {
    console.error('Error fetching data from Data USA API:', error);
    
    // Log the error to help debugging
    console.warn('Falling back to mock data due to API error');
    
    // Return mock data for testing in case the API fails
    return generateMockData(endpoint);
  }
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
          "Population": Math.floor(Math.random() * 10000000) + 500000,
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear - 5,
          "Year": (currentYear - 5).toString(),
          "Population": Math.floor(Math.random() * 9000000) + 400000,
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
          "Household Income": Math.floor(Math.random() * 40000) + 40000,
          "Household Income by Race": Math.floor(Math.random() * 45000) + 35000,
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear - 5,
          "Year": (currentYear - 5).toString(),
          "Household Income": Math.floor(Math.random() * 35000) + 35000,
          "Household Income by Race": Math.floor(Math.random() * 40000) + 30000,
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
          "Educational Attainment by Race%": Math.random() * 0.4 + 0.2,
          "Educational Attainment by Sex%": Math.random() * 0.4 + 0.2,
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
        mockData.push({
          "ID State": state,
          "State": state,
          "ID Year": currentYear - 2,
          "Year": (currentYear - 2).toString(),
          "Educational Attainment by Race%": Math.random() * 0.3 + 0.15,
          "Educational Attainment by Sex%": Math.random() * 0.3 + 0.15,
          "Slug State": state.toLowerCase().replace(/ /g, '-')
        });
      });
      break;
    
    default:
      // Default to population mock data
      return generateMockData('population');
  }
  
  return {
    source: `Mock ${endpoint} data (API unavailable)`,
    data: mockData,
    recordCount: mockData.length,
    processingTime: 0.5,
    endpoint: endpoint,
    isMockData: true
  };
}

// Helper function to calculate Pearson correlation coefficient
function calculateCorrelation(x, y) {
  if (x.length !== y.length) {
    return 0;
  }
  
  const n = x.length;
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate correlation coefficient
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;
    
    numerator += xDiff * yDiff;
    denominatorX += xDiff * xDiff;
    denominatorY += yDiff * yDiff;
  }
  
  if (denominatorX === 0 || denominatorY === 0) {
    return 0;
  }
  
  return numerator / Math.sqrt(denominatorX * denominatorY);
}

// Helper function to calculate standard deviation
function calculateStandardDeviation(values) {
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

// Helper function to calculate skewness
function calculateSkewness(values, mean, stdDev) {
  const n = values.length;
  const cubedDeviations = values.map(val => Math.pow((val - mean) / stdDev, 3));
  return (cubedDeviations.reduce((sum, val) => sum + val, 0) / n);
}

// Helper function to find anomalies (values outside 2 standard deviations)
function findDataAnomalies(values, mean, stdDev) {
  return values
    .map((value, index) => ({ value, index, zscore: Math.abs((value - mean) / stdDev) }))
    .filter(item => item.zscore > 2)
    .sort((a, b) => b.zscore - a.zscore); // Sort by z-score descending
}
