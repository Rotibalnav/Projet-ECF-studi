// public/api.js
// Helper fetch + JWT

export function getToken() {
  return localStorage.getItem('ecoride_token');
}

export function setToken(token) {
  localStorage.setItem('ecoride_token', token);
}

export function clearToken() {
  localStorage.removeItem('ecoride_token');
}

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (res.status === 401) {
    // token expired / invalid
    clearToken();
  }

  if (!res.ok) {
    throw new Error(data.error || 'Erreur serveur');
  }

  return data;
}
