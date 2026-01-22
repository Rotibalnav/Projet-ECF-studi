import { clearToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('[data-logout], #logout-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '../index.html';
  });
});
