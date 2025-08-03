/**
 * Smart API Configuration
 * Automatically detects environment and provides correct API URL
 * This prevents login issues caused by misconfigured environment variables
 */

const getApiUrl = () => {
  // Get the current hostname
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001/api';
  }
  
  // Production domain
  if (hostname === 'viticultwhisky.co.uk' || hostname === 'www.viticultwhisky.co.uk') {
    return 'https://viticultwhisky.co.uk/api';
  }
  
  // Staging or other environments can be added here
  // if (hostname === 'staging.viticultwhisky.co.uk') {
  //   return 'https://staging.viticultwhisky.co.uk/api';
  // }
  
  // Fallback to environment variable if set, otherwise default to localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
};

// Export the API URL
export const API_URL = getApiUrl();

// Helper function to ensure URL doesn't have double /api
export const normalizeApiUrl = (url) => {
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  
  // If URL already ends with /api, return as is
  if (url.endsWith('/api')) {
    return url;
  }
  
  // Otherwise, append /api
  return `${url}/api`;
};

// Helper function to build API endpoints
export const buildApiEndpoint = (endpoint) => {
  // Remove leading slash if present
  endpoint = endpoint.replace(/^\//, '');
  
  // Remove 'api/' prefix if present (to avoid double /api)
  endpoint = endpoint.replace(/^api\//, '');
  
  return `${API_URL}/${endpoint}`;
};

// Log the configuration in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    hostname: window.location.hostname,
    apiUrl: API_URL,
    envVar: process.env.REACT_APP_API_URL
  });
}

const apiConfig = {
  API_URL,
  normalizeApiUrl,
  buildApiEndpoint
};

export default apiConfig;