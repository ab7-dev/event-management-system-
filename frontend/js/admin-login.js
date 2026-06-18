document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const alertContainer = document.getElementById('alert-container');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showAlert('alert-container', 'Username and password are required', 'danger');
      return;
    }

    try {
      const payload = { username, password };
      const response = await apiRequest('/auth/login', 'POST', payload);
      
      showAlert('alert-container', 'Login successful! Redirecting...', 'success');
      
      // Redirect to Admin Dashboard after a small delay
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 1000);
    } catch (error) {
      showAlert('alert-container', error.message || 'Invalid username or password', 'danger');
    }
  });
});
