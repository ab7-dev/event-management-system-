// Common API configurations and request helpers
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Perform an HTTP Request to the Backend API
 * @param {string} endpoint - API path (e.g. '/events')
 * @param {string} method - HTTP Verb (GET, POST, PUT, DELETE)
 * @param {object|null} data - Body payload object or null
 * @returns {Promise<any>} Response json payload
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {}
  };

  // If payload exists, set content-type and stringify body
  if (data) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  // Include credentials for sessions (cookies)
  options.credentials = 'include';

  try {
    const response = await fetch(url, options);
    
    // Parse JSON safely
    let responseData = {};
    const text = await response.text();
    if (text) {
      responseData = JSON.parse(text);
    }

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Utility to display alert banners in containers
function showAlert(containerId, message, type = 'success') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  // Auto scroll to alert
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Utility to format date string
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Utility to format 24h time to 12h AM/PM
function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  let hrs = parseInt(hours);
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; // the hour '0' should be '12'
  return `${hrs}:${minutes} ${ampm}`;
}
