// Dashboard state management
let events = [];
let registrations = [];

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verify User is Authenticated as Admin
  try {
    const authStatus = await apiRequest('/auth/check');
    if (!authStatus.authenticated) {
      // Redirect unauthorized users to login page
      window.location.href = 'admin-login.html';
      return;
    }
    document.getElementById('welcome-message').textContent = `Welcome back, ${authStatus.username}! Manage college events and review user registrations.`;
  } catch (error) {
    window.location.href = 'admin-login.html';
    return;
  }

  // 2. Add Event Listeners
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  document.getElementById('add-event-btn').addEventListener('click', () => openModal());
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('event-form-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('event-form').addEventListener('submit', handleEventFormSubmit);

  // 3. Load initial data
  loadDashboardData();
});

// Load all events and registrations from API
async function loadDashboardData() {
  try {
    events = await apiRequest('/events');
    renderEventsTable(events);
    
    registrations = await apiRequest('/registrations');
    renderRegistrationsTable(registrations);
  } catch (error) {
    showAlert('alert-container', 'Failed to load dashboard data. Please make sure backend is running.', 'danger');
  }
}

// Render Events Table row-by-row
function renderEventsTable(eventList) {
  const tableBody = document.getElementById('events-table-body');
  tableBody.innerHTML = '';

  if (eventList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No events found. Create one to get started!</td></tr>`;
    return;
  }

  eventList.forEach(event => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${event.title}</td>
      <td>${formatDate(event.date)} at ${formatTime(event.time)}</td>
      <td>${event.venue}</td>
      <td>${event.organizer || 'College Event Committee'}</td>
      <td>
        <div class="action-btn-group">
          <button class="action-btn action-btn-edit" onclick="editEvent('${event._id}')" id="btn-edit-${event._id}">Edit</button>
          <button class="action-btn action-btn-delete" onclick="deleteEvent('${event._id}')" id="btn-delete-${event._id}">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Render Registrations Table row-by-row
function renderRegistrationsTable(registrationList) {
  const tableBody = document.getElementById('registrations-table-body');
  tableBody.innerHTML = '';

  if (registrationList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No registrations received yet.</td></tr>`;
    return;
  }

  registrationList.forEach(reg => {
    const eventTitle = reg.eventId ? reg.eventId.title : '<span style="color:red; font-style:italic;">Deleted Event</span>';
    tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${reg.name}</td>
      <td><a href="mailto:${reg.email}" style="color: var(--primary); text-decoration: none;">${reg.email}</a></td>
      <td>${reg.phone}</td>
      <td>${eventTitle}</td>
      <td>${formatDate(reg.createdAt)}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Tab switcher mechanism
window.switchTab = function(tabName) {
  // Update Buttons
  document.getElementById('tab-events').classList.toggle('active', tabName === 'events');
  document.getElementById('tab-registrations').classList.toggle('active', tabName === 'registrations');

  // Update Containers
  document.getElementById('content-events').classList.toggle('active', tabName === 'events');
  document.getElementById('content-registrations').classList.toggle('active', tabName === 'registrations');
};

// Modal handlers
const modal = document.getElementById('event-modal');

function openModal(eventData = null) {
  const form = document.getElementById('event-form');
  form.reset();
  
  if (eventData) {
    // Edit mode
    document.getElementById('modal-title').textContent = 'Edit Event';
    document.getElementById('event-form-id').value = eventData._id;
    document.getElementById('event-form-title').value = eventData.title;
    document.getElementById('event-form-desc').value = eventData.description;
    document.getElementById('event-form-date').value = eventData.date;
    document.getElementById('event-form-time').value = eventData.time;
    document.getElementById('event-form-venue').value = eventData.venue;
    document.getElementById('event-form-organizer').value = eventData.organizer || '';
    document.getElementById('event-form-image').value = eventData.image || '';
  } else {
    // Add mode
    document.getElementById('modal-title').textContent = 'Create New Event';
    document.getElementById('event-form-id').value = '';
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

// Handle Form Submission for Create or Edit
async function handleEventFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('event-form-id').value;
  const title = document.getElementById('event-form-title').value.trim();
  const description = document.getElementById('event-form-desc').value.trim();
  const date = document.getElementById('event-form-date').value;
  const time = document.getElementById('event-form-time').value;
  const venue = document.getElementById('event-form-venue').value.trim();
  const organizer = document.getElementById('event-form-organizer').value.trim();
  const image = document.getElementById('event-form-image').value.trim();

  const payload = { title, description, date, time, venue, organizer, image };

  try {
    if (id) {
      // EDIT existing event
      await apiRequest(`/events/${id}`, 'PUT', payload);
      showAlert('alert-container', 'Event updated successfully!', 'success');
    } else {
      // CREATE new event
      await apiRequest('/events', 'POST', payload);
      showAlert('alert-container', 'Event created successfully!', 'success');
    }

    closeModal();
    loadDashboardData();
  } catch (error) {
    showAlert('alert-container', error.message || 'Failed to save event. Please check inputs.', 'danger');
  }
}

// Edit handler mapping (called from table inline script)
window.editEvent = function(id) {
  const eventData = events.find(e => e._id === id);
  if (eventData) {
    openModal(eventData);
  }
};

// Delete event handler
window.deleteEvent = async function(id) {
  if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
    return;
  }

  try {
    await apiRequest(`/events/${id}`, 'DELETE');
    showAlert('alert-container', 'Event deleted successfully!', 'success');
    loadDashboardData();
  } catch (error) {
    showAlert('alert-container', error.message || 'Failed to delete event.', 'danger');
  }
};

// Handle Admin Logout
async function handleLogout(e) {
  e.preventDefault();
  try {
    await apiRequest('/auth/logout', 'POST');
    window.location.href = 'admin-login.html';
  } catch (error) {
    showAlert('alert-container', 'Failed to log out correctly.', 'danger');
  }
}
