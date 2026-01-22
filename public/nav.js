import { getToken, clearToken, apiFetch } from './api.js';

async function hydrateNav() {
  const authLabel = document.querySelector('[data-auth-label]');
  const loginLink = document.querySelector('[data-login-link]');
  const logoutLink = document.querySelector('[data-logout-link]');
  const userBadge = document.querySelector('[data-user-badge]');

  const token = getToken();

  if (!token) {
    if (authLabel) authLabel.textContent = 'Connexion';
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (userBadge) userBadge.textContent = '';
    return;
  }

  try {
    const { user } = await apiFetch('/api/auth/me');
    if (authLabel) authLabel.textContent = user?.prenom ? `Bonjour ${user.prenom}` : 'Mon compte';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
    if (userBadge) userBadge.textContent = user?.role ? `(${user.role})` : '';
  } catch {
    clearToken();
    if (authLabel) authLabel.textContent = 'Connexion';
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (userBadge) userBadge.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', hydrateNav);
