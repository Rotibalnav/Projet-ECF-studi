import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#logout-btn, [data-logout]");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "../index.html";
  });
});