'use strict';

/**
 * TRACKING SYSTEM
 * 
 * This system allows users to track shipments using consignment number and date.
 * Admin can manually update vehicle locations and status.
 * Username: Vikas, Password: Vikas
 */

// Global variables
let trackingMap = null;
let adminMap = null;
let currentMarker = null;
let adminMarker = null;
let isAdminLoggedIn = false;

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const trackingForm = document.getElementById('trackingForm');
const trackingResult = document.getElementById('trackingResult');
const quickTrackingForm = document.getElementById('quickTrackingForm');
const quickTrackingResult = document.getElementById('quickTrackingResult');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminModal = document.getElementById('adminModal');
const closeModal = document.getElementById('closeModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminForm = document.getElementById('adminForm');

// API Functions
async function trackShipmentAPI(consignmentNumber, shipmentDate) {
  try {
    const response = await fetch(`${API_BASE_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consignmentNo: consignmentNumber,
        shipmentDate: shipmentDate
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return { success: false, error: 'Network error' };
  }
}

async function adminLoginAPI(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, error: 'Network error' };
  }
}

// Function to get location suggestions
async function getLocationSuggestions(query) {
  try {
    if (query.length < 3) return [];
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=5&addressdetails=1`);
    const data = await response.json();
    
    return data.map(item => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      type: item.type,
      importance: item.importance
    }));
  } catch (error) {
    console.error('Error getting location suggestions:', error);
    return [];
  }
}

// Function to get coordinates from location name
async function getCoordinatesFromLocation(locationName) {
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', India')}&limit=1`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      // Fallback to default coordinates (center of India)
      return {
        latitude: 23.5937,
        longitude: 78.9629
      };
    }
  } catch (error) {
    console.error('Error getting coordinates:', error);
    // Fallback to default coordinates
    return {
      latitude: 23.5937,
      longitude: 78.9629
    };
  }
}

async function updateShipmentAPI(consignmentNumber, origin, destination, dispatchDate, currentLocation, status, expectedDelivery, timeline) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consignmentNo: consignmentNumber,
        origin: origin,
        destination: destination,
        dispatchDate: dispatchDate,
        currentLocation: currentLocation,
        status: status,
        expectedDelivery: expectedDelivery,
        timeline: timeline
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`Shipment ${data.isNewShipment ? 'created' : 'updated'} successfully:`, data.shipment);
      showMessage(`Shipment ${data.isNewShipment ? 'created' : 'updated'} successfully!`, 'success');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating/creating shipment:', error);
    return { success: false, error: 'Network error' };
  }
}

// Initialize tracking system
function initTracking() {
  console.log('Initializing tracking system...');
  
  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    console.warn('Leaflet library not loaded yet. Maps will be initialized when available.');
    // Wait a bit for Leaflet to load
    setTimeout(() => {
      if (typeof L !== 'undefined') {
        console.log('Leaflet now available, initializing maps...');
        // Re-initialize any maps that might need it
        if (adminPanel && adminPanel.style.display === 'block') {
          initAdminMap();
        }
      }
    }, 1000);
  } else {
    console.log('Leaflet library is available');
  }
  
  // Initialize event listeners
  if (trackingForm) {
    trackingForm.addEventListener('submit', handleTrackingSubmit);
    console.log('Tracking form event listener added');
  }
  
  if (quickTrackingForm) {
    quickTrackingForm.addEventListener('submit', handleQuickTrackingSubmit);
    console.log('Quick tracking form event listener added');
  }
  
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', showAdminModal);
    console.log('Admin login button event listener added');
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', hideAdminModal);
    console.log('Close modal event listener added');
  }
  
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    console.log('Admin login form event listener added');
  }
  
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', handleAdminLogout);
    console.log('Admin logout button event listener added');
  }
  
  if (adminForm) {
    adminForm.addEventListener('submit', handleAdminUpdate);
    console.log('Admin form event listener added');
    
    // Initialize location autocomplete
    initLocationAutocomplete();
  }
  
  // Close modal when clicking outside
  if (adminModal) {
    adminModal.addEventListener('click', function(e) {
      if (e.target === adminModal) {
        hideAdminModal();
      }
    });
  }
  
  console.log('Tracking system initialized successfully');
}

// Handle tracking form submission
async function handleTrackingSubmit(e) {
  e.preventDefault();
  console.log('Tracking form submitted');
  
  const consignmentNumber = document.getElementById('consignmentNumber').value.trim().toUpperCase();
  const shipmentDate = document.getElementById('shipmentDate').value;
  
  if (!consignmentNumber || !shipmentDate) {
    showMessage('Please fill in all fields', 'error');
    return;
  }
  
  console.log('Tracking shipment:', consignmentNumber, shipmentDate);
  
  // Show loading state
  const trackBtn = document.querySelector('.track-btn');
  const originalText = trackBtn.innerHTML;
  trackBtn.innerHTML = '<span class="loading"></span> Tracking...';
  trackBtn.disabled = true;
  
  try {
    const result = await trackShipmentAPI(consignmentNumber, shipmentDate);
    
    if (result.success) {
      displayTrackingResult(result.shipment);
      showMessage('Shipment found successfully!', 'success');
    } else {
      showMessage(result.error || 'Shipment not found', 'error');
      if (trackingResult) {
        trackingResult.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error tracking shipment:', error);
    showMessage('Error tracking shipment. Please try again.', 'error');
  } finally {
    // Restore button state
    trackBtn.innerHTML = originalText;
    trackBtn.disabled = false;
  }
}

// Handle quick tracking form submission
async function handleQuickTrackingSubmit(e) {
  e.preventDefault();
  console.log('Quick tracking form submitted');
  
  const consignmentNumber = document.getElementById('quickConsignmentNumber').value.trim().toUpperCase();
  const shipmentDate = document.getElementById('quickShipmentDate').value;
  
  if (!consignmentNumber || !shipmentDate) {
    showQuickMessage('Please fill in all fields', 'error');
    return;
  }
  
  console.log('Quick tracking shipment:', consignmentNumber, shipmentDate);
  
  // Show loading state
  const quickTrackBtn = document.querySelector('.quick-track-btn');
  const originalText = quickTrackBtn.innerHTML;
  quickTrackBtn.innerHTML = '<span class="loading"></span> Tracking...';
  quickTrackBtn.disabled = true;
  
  try {
    const result = await trackShipmentAPI(consignmentNumber, shipmentDate);
    
    if (result.success) {
      displayQuickTrackingResult(result.shipment);
      showQuickMessage('Shipment found successfully!', 'success');
    } else {
      showQuickMessage(result.error || 'Shipment not found', 'error');
      if (quickTrackingResult) {
        quickTrackingResult.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error tracking shipment:', error);
    showQuickMessage('Error tracking shipment. Please try again.', 'error');
  } finally {
    // Restore button state
    quickTrackBtn.innerHTML = originalText;
    quickTrackBtn.disabled = false;
  }
}

// Display tracking result
function displayTrackingResult(shipment) {
  if (!trackingResult) return;
  
  console.log('Displaying tracking result:', shipment);
  
  // Update shipment details
  document.getElementById('displayConsignmentNo').textContent = shipment.consignmentNo;
  document.getElementById('displayOrigin').textContent = shipment.origin;
  document.getElementById('displayDestination').textContent = shipment.destination;
  document.getElementById('displayStatus').textContent = shipment.status;
  document.getElementById('displayCurrentLocation').textContent = shipment.currentLocation;
  
  // Format and display dispatch date
  const dispatchDate = shipment.dispatchDate || shipment.shipmentDate;
  console.log('Raw dispatch date:', dispatchDate);
  const formattedDispatchDate = formatDate(dispatchDate);
  console.log('Formatted dispatch date:', formattedDispatchDate);
  document.getElementById('displayDispatchDate').textContent = formattedDispatchDate;
  
  // Format and display expected delivery date
  const expectedDeliveryDate = shipment.expectedDelivery;
  console.log('Raw expected delivery date:', expectedDeliveryDate);
  const formattedExpectedDate = formatDate(expectedDeliveryDate);
  console.log('Formatted expected delivery date:', formattedExpectedDate);
  document.getElementById('displayExpectedDelivery').textContent = formattedExpectedDate;
  
  // Update status class
  const statusElement = document.getElementById('displayStatus');
  statusElement.className = `value status ${getStatusClass(shipment.status)}`;
  
  // Build timeline
  const timelineContainer = document.getElementById('trackingTimeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = buildTimeline(shipment.timeline);
  }
  
  // Initialize map
  initTrackingMap(shipment);
  
  // Show result
  trackingResult.style.display = 'block';
  
  // Scroll to result
  trackingResult.scrollIntoView({ behavior: 'smooth' });
}

// Display quick tracking result
function displayQuickTrackingResult(shipment) {
  if (!quickTrackingResult) return;
  
  console.log('Displaying quick tracking result:', shipment);
  
  // Update shipment details
  document.getElementById('quickDisplayConsignmentNo').textContent = shipment.consignmentNo;
  document.getElementById('quickDisplayOrigin').textContent = shipment.origin;
  document.getElementById('quickDisplayDestination').textContent = shipment.destination;
  document.getElementById('quickDisplayStatus').textContent = shipment.status;
  document.getElementById('quickDisplayCurrentLocation').textContent = shipment.currentLocation;
  document.getElementById('quickDisplayExpectedDelivery').textContent = shipment.expectedDelivery;
  
  // Update status class
  const statusElement = document.getElementById('quickDisplayStatus');
  statusElement.className = `value status ${getStatusClass(shipment.status)}`;
  
  // Build timeline
  const timelineContainer = document.getElementById('quickTrackingTimeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = buildTimeline(shipment.timeline);
  }
  
  // Initialize map
  initQuickTrackingMap(shipment);
  
  // Show result
  quickTrackingResult.style.display = 'block';
  
  // Scroll to result
  quickTrackingResult.scrollIntoView({ behavior: 'smooth' });
}

// Initialize tracking map
function initTrackingMap(shipment) {
  const mapContainer = document.getElementById('trackingMap');
  if (!mapContainer) return;
  
  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded. Map will not be displayed.');
    mapContainer.innerHTML = '<div class="map-error">Map unavailable - Leaflet library not loaded</div>';
    return;
  }
  
  try {
    // Clear existing map
    if (trackingMap) {
      trackingMap.remove();
    }
    
    // Initialize map
    trackingMap = L.map('trackingMap').setView([shipment.latitude, shipment.longitude], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(trackingMap);
    
    // Add marker
    currentMarker = L.marker([shipment.latitude, shipment.longitude])
      .addTo(trackingMap)
      .bindPopup(`<b>${shipment.currentLocation}</b><br>Status: ${shipment.status}`);
      
    console.log('Map initialized successfully');
  } catch (error) {
    console.error('Error initializing map:', error);
    mapContainer.innerHTML = '<div class="map-error">Error loading map</div>';
  }
}

// Initialize quick tracking map
function initQuickTrackingMap(shipment) {
  const mapContainer = document.getElementById('quickTrackingMap');
  if (!mapContainer) return;
  
  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded. Quick tracking map will not be displayed.');
    mapContainer.innerHTML = '<div class="map-error">Map unavailable - Leaflet library not loaded</div>';
    return;
  }
  
  try {
    // Clear existing map
    if (trackingMap) {
      trackingMap.remove();
    }
    
    // Initialize map
    trackingMap = L.map('quickTrackingMap').setView([shipment.latitude, shipment.longitude], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(trackingMap);
    
    // Add marker
    currentMarker = L.marker([shipment.latitude, shipment.longitude])
      .addTo(trackingMap)
      .bindPopup(`<b>${shipment.currentLocation}</b><br>Status: ${shipment.status}`);
      
    console.log('Quick tracking map initialized successfully');
  } catch (error) {
    console.error('Error initializing quick tracking map:', error);
    mapContainer.innerHTML = '<div class="map-error">Error loading map</div>';
  }
}

// Build timeline HTML
function buildTimeline(timeline) {
  return timeline.map(item => `
    <div class="timeline-item ${item.completed ? 'completed' : ''}">
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-location">${item.location}</span>
          <span class="timeline-time">${item.time}</span>
        </div>
        <p class="timeline-description">${item.description}</p>
      </div>
    </div>
  `).join('');
}

// Get status class for styling
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'in transit':
      return 'in-transit';
    case 'out for delivery':
      return 'out-for-delivery';
    case 'delivered':
      return 'delivered';
    case 'delayed':
      return 'delayed';
    default:
      return 'in-transit';
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Show admin modal
function showAdminModal() {
  if (adminModal) {
    adminModal.style.display = 'flex';
  }
}

// Hide admin modal
function hideAdminModal() {
  if (adminModal) {
    adminModal.style.display = 'none';
    adminLoginForm.reset();
  }
}

// Handle admin login
async function handleAdminLogin(e) {
  e.preventDefault();
  console.log('Admin login attempted');
  
  const username = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  console.log('Username:', username);
  console.log('Password:', password);
  
  // Show loading state
  const loginBtn = document.querySelector('.admin-login-submit');
  const originalText = loginBtn.textContent;
  loginBtn.textContent = 'Logging in...';
  loginBtn.disabled = true;
  
  try {
    const result = await adminLoginAPI(username, password);
    
    if (result.success) {
      console.log('Admin login successful');
      isAdminLoggedIn = true;
      hideAdminModal();
      showAdminPanel();
      showMessage('Admin login successful!', 'success');
    } else {
      console.log('Admin login failed');
      showMessage(result.error || 'Invalid username or password', 'error');
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    showMessage('Network error. Please try again.', 'error');
  } finally {
    // Restore button state
    loginBtn.textContent = originalText;
    loginBtn.disabled = false;
  }
}

// Show admin panel
function showAdminPanel() {
  if (adminPanel) {
    adminPanel.style.display = 'block';
    initAdminMap();
  }
}

// Initialize location autocomplete
function initLocationAutocomplete() {
  const locationInput = document.getElementById('adminCurrentLocation');
  const suggestionsContainer = document.getElementById('locationSuggestions');
  
  if (!locationInput) return;
  
  let currentSuggestions = [];
  let selectedIndex = -1;
  let debounceTimer;
  
  // Handle input changes
  locationInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // Hide suggestions if query is too short
    if (query.length < 3) {
      hideSuggestions();
      return;
    }
    
    // Debounce API calls
    debounceTimer = setTimeout(async () => {
      currentSuggestions = await getLocationSuggestions(query);
      displaySuggestions(currentSuggestions);
    }, 300);
  });
  
  // Handle keyboard navigation
  locationInput.addEventListener('keydown', function(e) {
    if (!suggestionsContainer.style.display || suggestionsContainer.style.display === 'none') return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
        updateSelection();
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection();
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
          selectSuggestion(currentSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        hideSuggestions();
        break;
    }
  });
  
  // Handle clicks outside to close suggestions
  document.addEventListener('click', function(e) {
    if (!locationInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      hideSuggestions();
    }
  });
  
  // Display suggestions
  function displaySuggestions(suggestions) {
    if (suggestions.length === 0) {
      hideSuggestions();
      return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map((suggestion, index) => `
      <div class="location-suggestion-item" data-index="${index}">
        <div class="suggestion-title">${suggestion.display_name.split(',')[0]}</div>
        <div class="suggestion-details">${suggestion.display_name}</div>
      </div>
    `).join('');
    
    suggestionsContainer.style.display = 'block';
    selectedIndex = -1;
    
    // Add click listeners to suggestions
    suggestionsContainer.querySelectorAll('.location-suggestion-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        selectSuggestion(suggestions[index]);
      });
    });
  }
  
  // Update selection highlight
  function updateSelection() {
    suggestionsContainer.querySelectorAll('.location-suggestion-item').forEach((item, index) => {
      item.classList.toggle('selected', index === selectedIndex);
    });
  }
  
  // Select a suggestion
  function selectSuggestion(suggestion) {
    locationInput.value = suggestion.display_name;
    hideSuggestions();
    
    // Show success message
    showMessage(`Location selected: ${suggestion.display_name}`, 'success');
  }
  
  // Hide suggestions
  function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
    selectedIndex = -1;
  }
}

// Initialize admin map
function initAdminMap() {
  const mapContainer = document.getElementById('adminMap');
  if (!mapContainer) return;
  
  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded. Admin map will not be displayed.');
    mapContainer.innerHTML = '<div class="map-error">Map unavailable - Leaflet library not loaded</div>';
    return;
  }
  
  try {
    // Clear existing map
    if (adminMap) {
      adminMap.remove();
    }
    
    // Initialize map centered on India
    adminMap = L.map('adminMap').setView([23.5937, 78.9629], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(adminMap);
    
    console.log('Admin map initialized successfully');
    // Map is now just for display - coordinates are auto-generated from location name
  } catch (error) {
    console.error('Error initializing admin map:', error);
    mapContainer.innerHTML = '<div class="map-error">Error loading admin map</div>';
  }
}

// Handle admin logout
function handleAdminLogout() {
  isAdminLoggedIn = false;
  if (adminPanel) {
    adminPanel.style.display = 'none';
  }
  showMessage('Logged out successfully', 'info');
}

// Handle admin update
async function handleAdminUpdate(e) {
  e.preventDefault();
  console.log('Admin update form submitted');
  
  const consignmentNumber = document.getElementById('adminConsignmentNo').value.trim().toUpperCase();
  const origin = document.getElementById('adminOrigin').value.trim();
  const destination = document.getElementById('adminDestination').value.trim();
  const status = document.getElementById('adminStatus').value;
  const currentLocation = document.getElementById('adminCurrentLocation').value.trim();
  const dispatchDate = document.getElementById('adminDispatchDate').value;
  const expectedDelivery = document.getElementById('adminExpectedDelivery').value;
  const timeline = document.getElementById('adminTimeline').value.trim();
  
  console.log('Form field values:', {
    consignmentNumber,
    origin,
    destination,
    status,
    currentLocation,
    dispatchDate,
    expectedDelivery,
    timeline
  });
  
  console.log('Update data:', { consignmentNumber, origin, destination, status, currentLocation, dispatchDate, expectedDelivery, timeline });
  
  if (!consignmentNumber || !origin || !destination || !status || !currentLocation || !dispatchDate || !expectedDelivery || !timeline) {
    console.log('Validation failed:', {
      consignmentNumber: !!consignmentNumber,
      origin: !!origin,
      destination: !!destination,
      status: !!status,
      currentLocation: !!currentLocation,
      dispatchDate: !!dispatchDate,
      expectedDelivery: !!expectedDelivery,
      timeline: !!timeline
    });
    showMessage('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  const updateBtn = document.querySelector('.admin-submit');
  const originalText = updateBtn.textContent;
  updateBtn.textContent = 'Updating shipment...';
  updateBtn.disabled = true;
  
  try {
    console.log('Sending update request to API...');
    const result = await updateShipmentAPI(consignmentNumber, origin, destination, dispatchDate, currentLocation, status, expectedDelivery, timeline);
    console.log('API response:', result);
    
    if (result.success) {
      console.log(`Shipment ${result.isNewShipment ? 'created' : 'updated'} successfully:`, result.shipment);
      showMessage(`Shipment ${result.isNewShipment ? 'created' : 'updated'} successfully!`, 'success');
      
      // Clear form
      adminForm.reset();
      
      // Update marker on admin map if it exists
      if (adminMarker && adminMap) {
        adminMap.removeLayer(adminMarker);
        // Use default coordinates since we removed lat/lng fields
        adminMarker = L.marker([23.5937, 78.9629])
          .addTo(adminMap)
          .bindPopup(`${result.isNewShipment ? 'New' : 'Updated'} Location<br>${currentLocation}<br>Status: ${status}`);
      }
        
    } else {
      console.log('Update failed:', result.error);
      showMessage(result.error || 'Error updating shipment', 'error');
    }
  } catch (error) {
    console.error('Error updating shipment:', error);
    showMessage('Network error. Please try again.', 'error');
  } finally {
    // Restore button state
    updateBtn.textContent = originalText;
    updateBtn.disabled = false;
  }
}

// Show message function
function showMessage(message, type = 'info') {
  console.log('Showing message:', message, type);
  
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  // Insert message in appropriate location
  if (isAdminLoggedIn && adminPanel) {
    // Show admin messages in admin panel
    adminPanel.insertBefore(messageDiv, adminPanel.firstChild);
  } else if (trackingForm) {
    // Show user messages after tracking form
    trackingForm.parentNode.insertBefore(messageDiv, trackingForm.nextSibling);
  } else {
    // Fallback: append to body
    document.body.appendChild(messageDiv);
  }
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Show quick message function
function showQuickMessage(message, type = 'info') {
  console.log('Showing quick message:', message, type);
  
  // Remove existing quick messages
  const existingMessages = document.querySelectorAll('.quick-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type} quick-message`;
  messageDiv.textContent = message;
  
  // Insert message after form
  if (quickTrackingForm) {
    quickTrackingForm.parentNode.insertBefore(messageDiv, quickTrackingForm.nextSibling);
  } else {
    // Fallback: append to body
    document.body.appendChild(messageDiv);
  }
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tracking system initializing...');
  initTracking();
  
  // Test if elements exist
  console.log('Tracking form:', !!trackingForm);
  console.log('Admin login btn:', !!adminLoginBtn);
  console.log('Admin modal:', !!adminModal);
  console.log('Admin form:', !!adminForm);
  console.log('Tracking result:', !!trackingResult);
  
  // Test API connection
  console.log('Testing API connection...');
  fetch('http://localhost:3000/api/admin/shipments')
    .then(response => response.json())
    .then(data => {
      console.log('✅ API connection successful');
      console.log('Available shipments:', data.shipments.length);
    })
    .catch(error => {
      console.error('❌ API connection failed:', error);
    });
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTracking);
} else {
  initTracking();
}

// Export functions for global access (if needed)
window.trackingSystem = {
  trackShipmentAPI,
  adminLoginAPI,
  updateShipmentAPI,
  displayTrackingResult,
  showAdminPanel
};

// Test function to verify system is working
window.testTrackingSystem = function() {
  console.log('=== TRACKING SYSTEM TEST ===');
  console.log('1. Testing API connection...');
  
  fetch('http://localhost:3000/api/admin/shipments')
    .then(response => response.json())
    .then(data => {
      console.log('✅ API connection successful');
      console.log('Available shipments:', data.shipments.length);
      data.shipments.forEach(shipment => {
        console.log(`- ${shipment.consignmentNo}: ${shipment.status}`);
      });
    })
    .catch(error => {
      console.error('❌ API connection failed:', error);
    });
  
  console.log('2. Testing admin login...');
  adminLoginAPI('Vikas', 'Vikas')
    .then(result => {
      if (result.success) {
        console.log('✅ Admin login successful');
      } else {
        console.log('❌ Admin login failed:', result.error);
      }
    })
    .catch(error => {
      console.error('❌ Admin login error:', error);
    });
  
  console.log('3. Testing shipment tracking...');
  trackShipmentAPI('TC001', '2025-01-10')
    .then(result => {
      if (result.success) {
        console.log('✅ Shipment tracking successful');
        console.log('Shipment found:', result.shipment.consignmentNo);
      } else {
        console.log('❌ Shipment tracking failed:', result.error);
      }
    })
    .catch(error => {
      console.error('❌ Shipment tracking error:', error);
    });
  
  console.log('=== TEST COMPLETE ===');
  console.log('Open browser console to see results');
};

// Auto-run test when page loads (for debugging)
if (window.location.href.includes('tracking.html')) {
  setTimeout(() => {
    console.log('Running system test in 3 seconds...');
    setTimeout(window.testTrackingSystem, 3000);
  }, 1000);
} 