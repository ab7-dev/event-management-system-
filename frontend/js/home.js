document.addEventListener('DOMContentLoaded', () => {
  let allEvents = [];
  const eventsGrid = document.getElementById('events-grid');
  const searchBar = document.getElementById('search-bar');
  const eventCountEl = document.getElementById('event-count');
  const alertContainer = document.getElementById('alert-container');

  // Fetch all events on load
  fetchEvents();

  async function fetchEvents() {
    try {
      allEvents = await apiRequest('/events');
      renderEvents(allEvents);
    } catch (error) {
      showAlert('alert-container', 'Failed to fetch events. Please verify the server is running.', 'danger');
      eventCountEl.textContent = 'Error loading events';
    }
  }

  function renderEvents(events) {
    eventsGrid.innerHTML = '';
    eventCountEl.textContent = `Showing ${events.length} event(s)`;

    if (events.length === 0) {
      eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <h3>No events found.</h3>
          <p>Try searching for something else or check back later!</p>
        </div>
      `;
      return;
    }

    events.forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';

      // Fallback image if empty
      const imageUrl = event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60';

      card.innerHTML = `
        <img class="event-card-img" src="${imageUrl}" alt="${event.title}" onerror="this.src='https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60'">
        <div class="event-card-body">
          <div class="event-card-date">${formatDate(event.date)}</div>
          <h3 class="event-card-title">${event.title}</h3>
          <p class="event-card-desc">${event.description}</p>
          <div class="event-card-meta">
            <span>📍 ${event.venue}</span>
            <span>⏰ ${formatTime(event.time)}</span>
          </div>
          <a href="event-detail.html?id=${event._id}" class="btn" id="btn-view-${event._id}">View Details</a>
        </div>
      `;
      eventsGrid.appendChild(card);
    });
  }

  // Search filter implementation
  searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderEvents(allEvents);
      return;
    }

    const filtered = allEvents.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    );

    renderEvents(filtered);
  });
});
