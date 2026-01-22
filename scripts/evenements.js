import Formulaire from './formulaire.js';
import { apiFetch } from '../public/api.js';

// Création du formulaire
const formulaire = new Formulaire('formulaire');

// Champs conditionnels
formulaire.maskChamp('vehicule');
formulaire.maskChamp('email');

// Radio statut
formulaire.getElement('passager').addEventListener('change', () => {
  formulaire.hideChamp('vehicule');
});

formulaire.getElement('covoitureur').addEventListener('change', () => {
  formulaire.showChamp('vehicule');
});

// Objet : si annulation, on affiche l'email
formulaire.getElement('objet').addEventListener('change', () => {
  formulaire.isSelected(
    'objet',
    'annulation_de_trajet',
    () => formulaire.showChamp('email'),
    () => formulaire.hideChamp('email')
  );
});

function showFeedback(msg, ok = false) {
  const el = document.getElementById('contactFeedback');
  if (!el) return;
  el.textContent = msg;
  el.className = ok ? 'alert alert-success mt-3' : 'alert alert-danger mt-3';
}

// Soumission
formulaire.formulaireHtml.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(formulaire.formulaireHtml);

  const payload = {
    statut: formData.get('statut') || null,
    nom: (formData.get('nom') || '').toString().trim(),
    prenom: (formData.get('prenom') || '').toString().trim(),
    vehicule: (formData.get('vehicule') || '').toString().trim(),
    objet: (formData.get('objet') || '').toString().trim(),
    email: (formData.get('email') || '').toString().trim(),
    message: (formData.get('message') || '').toString().trim()
  };

  if (!payload.nom || !payload.prenom || !payload.objet || !payload.message) {
    showFeedback('Merci de remplir les champs obligatoires.');
    return;
  }

  // Si passager : pas de véhicule
  if (payload.statut === 'passager') {
    payload.vehicule = '';
  }

  try {
    await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    showFeedback('Message envoyé ✅ Merci !', true);
    formulaire.formulaireHtml.reset();

    // Réappliquer les masques
    formulaire.maskChamp('vehicule');
    formulaire.maskChamp('email');
  } catch (e) {
    showFeedback(e.message);
  }
});
