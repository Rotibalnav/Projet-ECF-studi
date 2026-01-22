import { apiFetch, getToken } from './api.js';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.appendChild(c));
  return node;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  } catch {
    return dateStr;
  }
}

function renderTrips(container, trips) {
  container.innerHTML = '';

  if (!trips.length) {
    container.appendChild(
      el('div', { class: 'glass-card p-3 mt-4', text: 'Aucun trajet trouvé 😕' })
    );
    return;
  }

  const list = el('div', { class: 'trips-grid mt-4' });

  trips.forEach((t) => {
    const title = `${t.depart} → ${t.destination}`;
    const sub = `${formatDate(t.date_trajet)}${t.heure_depart ? ' • ' + t.heure_depart.slice(0, 5) : ''}`;
    const driver = `${t.conducteur_prenom} ${t.conducteur_nom}`;

    const card = el('div', { class: 'glass-card trip-card' });

    card.appendChild(el('h5', { class: 'trip-title', text: title }));
    card.appendChild(el('div', { class: 'trip-sub', text: sub }));
    card.appendChild(el('div', { class: 'trip-meta', text: `Conducteur : ${driver}` }));
    card.appendChild(el('div', { class: 'trip-meta', text: `Places restantes : ${t.places_restantes}/${t.places_total}` }));
    card.appendChild(el('div', { class: 'trip-meta', text: `Prix : ${t.prix ?? '-'} €` }));
    if (t.commentaire) card.appendChild(el('div', { class: 'trip-comment', text: t.commentaire }));

    const row = el('div', { class: 'trip-actions' });

    const select = el('select', { class: 'form-select form-select-sm', 'aria-label': 'places' });
    const max = Math.min(Number(t.places_restantes), 4);
    for (let i = 1; i <= max; i += 1) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${i} place${i > 1 ? 's' : ''}`;
      select.appendChild(opt);
    }

    const btn = el('button', { class: 'btn btn-success btn-sm', text: 'Réserver' });

    btn.addEventListener('click', async () => {
      if (!getToken()) {
        const loginUrl = window.location.pathname.includes('/page/')
          ? './connexion_inscription.html'
          : './page/connexion_inscription.html';
        window.location.href = loginUrl;
        return;
      }

      btn.disabled = true;
      const places = Number(select.value);
      try {
        await apiFetch(`/api/trips/${t.id}/reserve`, {
          method: 'POST',
          body: JSON.stringify({ places })
        });
        btn.textContent = 'Réservé ✅';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-secondary');
      } catch (e) {
        alert(e.message);
        btn.disabled = false;
      }
    });

    row.appendChild(select);
    row.appendChild(btn);
    card.appendChild(row);

    list.appendChild(card);
  });

  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchcarpool');
  if (!searchBox) return;

  const dateInput = document.getElementById('date');
  const departInput = document.getElementById('departure');
  const destInput = document.getElementById('destination');
  const personInput = document.getElementById('person');
  const elleSwitch = document.getElementById('flexSwitchCheckDefault');
  const feedback = document.getElementById('formFeedback');

  const results = document.getElementById('searchResults') || (() => {
    const div = document.createElement('div');
    div.id = 'searchResults';
    searchBox.insertAdjacentElement('afterend', div);
    return div;
  })();

  const btn = searchBox.querySelector('button[type="submit"], button.btn');

  async function doSearch() {
    if (feedback) {
      feedback.textContent = '';
      feedback.className = '';
    }

    const date = dateInput?.value || '';
    const depart = departInput?.value || '';
    const destination = destInput?.value || '';
    const places = personInput?.value || '1';
    const elle = elleSwitch?.checked ? '1' : '0';

    if (!date || !depart || !destination) {
      if (feedback) {
        feedback.textContent = 'Merci de sélectionner une date, un départ et une destination.';
        feedback.className = 'alert alert-warning mt-3';
      }
      return;
    }

    if (btn) btn.disabled = true;

    try {
      const { trips } = await apiFetch(`/api/trips/search?date=${encodeURIComponent(date)}&depart=${encodeURIComponent(depart)}&destination=${encodeURIComponent(destination)}&places=${encodeURIComponent(places)}&elle=${elle}`);
      renderTrips(results, trips);
    } catch (e) {
      if (feedback) {
        feedback.textContent = e.message;
        feedback.className = 'alert alert-danger mt-3';
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      doSearch();
    });
  }
});
