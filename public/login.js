import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email =
      form.querySelector('input[name="email"], #email')?.value.trim();
    const password =
      form.querySelector('input[name="password"], #password')?.value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      window.location.href = "../connexion_inscription.html";
    } catch (err) {
      alert(err.message);
    }
  });
});