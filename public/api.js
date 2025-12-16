// public/js/api.js
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include", // 🔐 session
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data.error || "Erreur serveur");
  }

  return data;
}