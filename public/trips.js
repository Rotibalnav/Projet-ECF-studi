import { apiFetch, getToken } from './api.js';

// Leaflet is loaded globally via CDN in the HTML pages (window.L)
let routeMap = null;
let routeLayer = null;
let markerA = null;
let markerB = null;

function formatDistance(meters) {
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m} min`;
  return `${h} h ${m.toString().padStart(2, '0')} min`;
}

async function geocodePlace(q) {
  // Nominatim (OpenStreetMap) geocoding
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Impossible de géocoder les villes (réseau/limite).');
  const data = await res.json();
  if (!data?.length) throw new Error(`Ville introuvable : ${q}`);
  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    label: data[0].display_name
  };
}

async function fetchRoute(a, b) {
  // OSRM public demo server
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Impossible de calculer l’itinéraire (OSRM).');
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error('Aucun itinéraire trouvé.');
  return {
    distance: route.distance,
    duration: route.duration,
    geojson: route.geometry
  };
}

function ensureMapSection(afterEl) {
  let section = document.getElementById('mapSection');
  if (section) return section;

  section = document.createElement('div');
  section.id = 'mapSection';
  section.className = 'glass-card map-card mt-4';
  section.style.display = 'none';

  section.innerHTML = `
    <div class="map-head">
      <h3 class="map-title">Trajet sur la carte</h3>
      <div class="map-stats" id="mapStats">—</div>
    </div>
    <div id="routeMap" class="route-map"></div>
    <div class="map-hint">*Distance et temps estimés (itinéraire routier).</div>
  `;

  // Prefer keeping the map under the results column if possible
  const col = afterEl.closest?.('.results-column');
  if (col) col.appendChild(section);
  else afterEl.insertAdjacentElement('afterend', section);
  return section;
}

function initLeafletMap() {
  const L = window.L;
  if (!L) throw new Error('Leaflet non chargé. Vérifie ta connexion internet.');

  if (routeMap) return routeMap;
  routeMap = L.map('routeMap', {
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(routeMap);

  // Default view
  routeMap.setView([46.6, 2.5], 6);
  return routeMap;
}

async function renderRouteOnMap(depart, destination, resultsEl) {
  const section = ensureMapSection(resultsEl);
  const statsEl = section.querySelector('#mapStats');

  // Only display when we have results on screen
  section.style.display = 'block';
  statsEl.textContent = 'Calcul de l’itinéraire...';

  try {
    const [a, b] = await Promise.all([geocodePlace(depart), geocodePlace(destination)]);
    const route = await fetchRoute(a, b);

    const map = initLeafletMap();
    const L = window.L;

    // Cleanup previous layers
    if (routeLayer) {
      routeLayer.remove();
      routeLayer = null;
    }
    if (markerA) markerA.remove();
    if (markerB) markerB.remove();

    markerA = L.marker([a.lat, a.lon]).addTo(map);
    markerB = L.marker([b.lat, b.lon]).addTo(map);

    routeLayer = L.geoJSON(route.geojson, {
      style: {
        weight: 5,
        opacity: 0.9
      }
    }).addTo(map);

    const bounds = routeLayer.getBounds();
    map.fitBounds(bounds, { padding: [18, 18] });

    // If the map was hidden, Leaflet needs a refresh for correct rendering
    setTimeout(() => {
      try { map.invalidateSize(); } catch {}
    }, 180);

    statsEl.textContent = `${formatDistance(route.distance)} • ${formatDuration(route.duration)}`;
  } catch (err) {
    statsEl.textContent = `Carte indisponible : ${err.message}`;
  }
}

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

      // Map + route stats under results
      if (trips?.length) {
        renderRouteOnMap(depart, destination, results);
      } else {
        const section = document.getElementById('mapSection');
        if (section) section.style.display = 'none';
      }
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
