import { apiFetch, setToken } from './api.js';

function showFeedback(el, msg, ok = false) {
  if (!el) return;
  el.textContent = msg;
  el.className = ok ? 'alert alert-success mt-3' : 'alert alert-danger mt-3';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const feedback = document.getElementById('loginFeedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;

    if (!email || !password) {
      showFeedback(feedback, 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setToken(data.token);
      showFeedback(feedback, 'Connexion réussie ✅', true);

      // Redirect to carpool search
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 600);
    } catch (err) {
      showFeedback(feedback, err.message);
    }
  });
});
