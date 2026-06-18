document.addEventListener('DOMContentLoaded', async () => {
  // Get event ID from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  const loadingSpinner = document.getElementById('loading-spinner');
  const detailLayout = document.getElementById('detail-layout');
  const alertContainer = document.getElementById('alert-container');

  if (!eventId) {
    loadingSpinner.style.display = 'none';
    showAlert('alert-container', 'No event ID specified. Go back to home page.', 'danger');
    return;
  }

  try {
    const event = await apiRequest(`/events/${eventId}`);
    
    // Fill in Details
    document.getElementById('event-title').textContent = event.title;
    document.title = `${event.title} | CampusEvents`;
    document.getElementById('event-date').textContent = formatDate(event.date);
    document.getElementById('event-time').textContent = formatTime(event.time);
    document.getElementById('event-venue').textContent = event.venue;
    document.getElementById('event-organizer').textContent = event.organizer || 'College Event Committee';
    document.getElementById('event-desc').textContent = event.description;
    
    // Handle Image
    const imgEl = document.getElementById('event-image');
    if (event.image) {
      imgEl.src = event.image;
    } else {
      imgEl.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60';
    }

    // Set Up Register Button Link
    const registerBtn = document.getElementById('register-btn');
    registerBtn.href = `register.html?eventId=${event._id}`;

    // Toggle Visibility
    loadingSpinner.style.display = 'none';
    detailLayout.style.display = 'grid';
  } catch (error) {
    loadingSpinner.style.display = 'none';
    showAlert('alert-container', 'Failed to retrieve event details. The event might not exist.', 'danger');
  }
});
