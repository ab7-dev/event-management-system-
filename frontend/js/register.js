document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('eventId');

  const eventIdInput = document.getElementById('event-id');
  const subtitleEl = document.getElementById('registration-subtitle');
  const form = document.getElementById('register-form');
  const alertContainer = document.getElementById('alert-container');
  const successActions = document.getElementById('success-actions');

  if (!eventId) {
    showAlert('alert-container', 'Please select an event from the home page before registering.', 'danger');
    form.style.display = 'none';
    return;
  }

  eventIdInput.value = eventId;

  // Retrieve event information to show what the user is registering for
  try {
    const event = await apiRequest(`/events/${eventId}`);
    subtitleEl.innerHTML = `Registering for: <strong>${event.title}</strong><br>📍 ${event.venue} | ⏰ ${formatTime(event.time)}`;
  } catch (error) {
    console.error('Could not load event title', error);
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();

    // Verification check
    if (!name || !email || !phone) {
      showAlert('alert-container', 'Please fill in all fields.', 'danger');
      return;
    }

    try {
      const payload = {
        eventId,
        name,
        email,
        phone
      };

      const result = await apiRequest('/register', 'POST', payload);
      showAlert('alert-container', result.message || 'Registration completed successfully!', 'success');
      
      // Hide form & show back action
      form.style.display = 'none';
      successActions.style.display = 'block';
    } catch (error) {
      showAlert('alert-container', error.message || 'Registration failed. Please try again.', 'danger');
    }
  });
});
