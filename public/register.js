import { apiFetch, setToken } from './api.js';

function showFeedback(el, msg, ok = false) {
  if (!el) return;
  el.textContent = msg;
  el.className = ok ? 'alert alert-success mt-3' : 'alert alert-danger mt-3';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const feedback = document.getElementById('registerFeedback');
  const roleSelect = document.getElementById('role');
  const driverBox = document.getElementById('driverFields');

  if (!form) return;

  function updateDriverFields() {
    const role = roleSelect?.value || 'passager';
    if (!driverBox) return;
    driverBox.style.display = role === 'conducteur' ? 'block' : 'none';
  }

  if (roleSelect) {
    roleSelect.addEventListener('change', updateDriverFields);
    updateDriverFields();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      role: form.querySelector('[name="role"]').value,
      sexe: form.querySelector('[name="sexe"]').value,
      nom: form.querySelector('[name="nom"]').value.trim(),
      prenom: form.querySelector('[name="prenom"]').value.trim(),
      age: form.querySelector('[name="age"]').value,
      email: form.querySelector('[name="email"]').value.trim(),
      telephone: form.querySelector('[name="telephone"]').value.trim(),
      password: form.querySelector('[name="password"]').value,
      confirmPassword: form.querySelector('[name="confirm_password"]').value
    };

    if (!payload.nom || !payload.prenom || !payload.email || !payload.telephone) {
      showFeedback(feedback, 'Merci de remplir les champs obligatoires');
      return;
    }

    if (!payload.password || payload.password.length < 6) {
      showFeedback(feedback, 'Mot de passe trop court (min 6 caractères)');
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      showFeedback(feedback, 'Les mots de passe ne correspondent pas');
      return;
    }

    // Driver fields
    if (payload.role === 'conducteur') {
      payload.marque = form.querySelector('[name="marque"]').value.trim();
      payload.modele = form.querySelector('[name="modele"]').value.trim();
      payload.annee = form.querySelector('[name="annee"]').value;
      payload.energie_vehicule = form.querySelector('[name="energie_vehicule"]').value;
      payload.immatriculation = form.querySelector('[name="immatriculation"]').value.trim();
    }

    // Do not send confirmPassword
    delete payload.confirmPassword;

    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setToken(data.token);
      showFeedback(feedback, 'Inscription réussie ✅', true);

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 700);
    } catch (err) {
      showFeedback(feedback, err.message);
    }
  });
});
