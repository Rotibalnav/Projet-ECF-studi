import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import bcrypt from 'bcrypt';

import { createPoolFromEnv } from './src/db.js';
import { authRequired, signToken } from './src/auth.js';

dotenv.config();

const app = express();
const pool = createPoolFromEnv();

const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false })); // CSP off to allow CDN Bootstrap/FontAwesome
app.use(express.json({ limit: '1mb' }));

// Serve static front
app.use(express.static(process.cwd()));

// Small helper
function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

// Health
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: 'DB connection error' });
  }
});

// =========================
// AUTH
// =========================
app.post('/api/auth/register', async (req, res) => {
  const {
    role = 'passager',
    sexe,
    nom,
    prenom,
    age,
    email,
    telephone,
    password,
    // driver optional
    marque = null,
    modele = null,
    annee = null,
    energie_vehicule = null,
    immatriculation = null
  } = req.body || {};

  if (!sexe || !nom || !prenom || !age || !email || !telephone || !password) {
    return badRequest(res, 'Champs obligatoires manquants');
  }

  const cleanRole = role === 'conducteur' ? 'conducteur' : 'passager';
  const cleanSexe = (sexe === 'M' || sexe === 'F') ? sexe : null;
  if (!cleanSexe) return badRequest(res, 'Sexe invalide');

  const numericAge = Number(age);
  if (!Number.isFinite(numericAge) || numericAge < 16 || numericAge > 120) {
    return badRequest(res, 'Âge invalide');
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return badRequest(res, 'Email invalide');
  }

  if (typeof password !== 'string' || password.length < 6) {
    return badRequest(res, 'Mot de passe trop court (min 6 caractères)');
  }

  const vehicule = cleanRole === 'conducteur' ? 'voiture' : 'aucun';

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO utilisateurs (
         role, sexe, nom, prenom, age, email, telephone, mot_de_passe,
         vehicule, marque, modele, annee, energie_vehicule, immatriculation
       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        cleanRole,
        cleanSexe,
        nom.trim(),
        prenom.trim(),
        numericAge,
        email.trim().toLowerCase(),
        telephone.trim(),
        hashed,
        vehicule,
        vehicule === 'voiture' ? (marque?.trim?.() || null) : null,
        vehicule === 'voiture' ? (modele?.trim?.() || null) : null,
        vehicule === 'voiture' ? (annee ? Number(annee) : null) : null,
        vehicule === 'voiture' ? energie_vehicule : null,
        vehicule === 'voiture' ? (immatriculation?.trim?.() || null) : null
      ]
    );

    const userId = result.insertId;
    const token = signToken({ id: userId, role: cleanRole, prenom, nom, email });

    return res.status(201).json({
      message: 'Compte créé',
      token,
      user: { id: userId, role: cleanRole, prenom, nom, email: email.trim().toLowerCase() }
    });
  } catch (e) {
    // Duplicate errors
    if (String(e?.code) === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email / téléphone / immatriculation déjà utilisé' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return badRequest(res, 'Email et mot de passe requis');

  try {
    const [rows] = await pool.query(
      `SELECT id, role, nom, prenom, email, mot_de_passe FROM utilisateurs WHERE email = ? LIMIT 1`,
      [String(email).trim().toLowerCase()]
    );

    const user = rows?.[0];
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const ok = await bcrypt.compare(String(password), user.mot_de_passe);
    if (!ok) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = signToken({ id: user.id, role: user.role, prenom: user.prenom, nom: user.nom, email: user.email });

    return res.json({
      token,
      user: { id: user.id, role: user.role, prenom: user.prenom, nom: user.nom, email: user.email }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, role, nom, prenom, age, sexe, email, telephone, vehicule, marque, modele, annee, energie_vehicule, immatriculation
       FROM utilisateurs WHERE id = ? LIMIT 1`,
      [req.user.id]
    );
    const me = rows?.[0];
    if (!me) return res.status(404).json({ error: 'Utilisateur introuvable' });
    return res.json({ user: me });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =========================
// TRIPS SEARCH
// =========================
app.get('/api/trips/search', async (req, res) => {
  const { date, depart, destination, places, elle } = req.query;

  const where = [];
  const params = [];

  if (date) {
    where.push('t.date_trajet = ?');
    params.push(date);
  }
  if (depart && depart !== 'Départ') {
    where.push('t.depart = ?');
    params.push(depart);
  }
  if (destination && destination !== 'Destination') {
    where.push('t.destination = ?');
    params.push(destination);
  }
  if (places) {
    where.push('t.places_restantes >= ?');
    params.push(Number(places));
  }
  if (elle === '1' || elle === 'true') {
    where.push("u.sexe = 'F'");
  }

  const sql = `
    SELECT
      t.id,
      t.date_trajet,
      t.heure_depart,
      t.depart,
      t.destination,
      t.places_restantes,
      t.places_total,
      t.prix,
      t.commentaire,
      u.prenom AS conducteur_prenom,
      u.nom AS conducteur_nom,
      u.sexe AS conducteur_sexe
    FROM trajets t
    JOIN utilisateurs u ON u.id = t.conducteur_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY t.date_trajet ASC, t.heure_depart ASC
    LIMIT 50
  `;

  try {
    const [rows] = await pool.query(sql, params);
    return res.json({ trips: rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =========================
// RESERVE A TRIP (needs auth)
// =========================
app.post('/api/trips/:id/reserve', authRequired, async (req, res) => {
  const tripId = Number(req.params.id);
  const places = Number(req.body?.places || 1);

  if (!Number.isFinite(tripId)) return badRequest(res, 'Trajet invalide');
  if (!Number.isFinite(places) || places < 1 || places > 8) {
    return badRequest(res, 'Nombre de places invalide');
  }

  // Only passengers can reserve
  if (req.user.role !== 'passager') {
    return res.status(403).json({ error: 'Seuls les passagers peuvent réserver' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [tRows] = await conn.query(
      'SELECT id, places_restantes FROM trajets WHERE id = ? FOR UPDATE',
      [tripId]
    );

    const trip = tRows?.[0];
    if (!trip) {
      await conn.rollback();
      return res.status(404).json({ error: 'Trajet introuvable' });
    }

    if (trip.places_restantes < places) {
      await conn.rollback();
      return res.status(400).json({ error: 'Pas assez de places restantes' });
    }

    // Insert reservation
    await conn.query(
      'INSERT INTO reservations (trajet_id, passager_id, places_reservees, statut) VALUES (?,?,?,?)',
      [tripId, req.user.id, places, 'en_attente']
    );

    // Update remaining seats
    await conn.query(
      'UPDATE trajets SET places_restantes = places_restantes - ? WHERE id = ?',
      [places, tripId]
    );

    await conn.commit();
    return res.status(201).json({ message: 'Réservation enregistrée (en attente)' });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

// =========================
// CONTACT
// =========================
app.post('/api/contact', async (req, res) => {
  const { statut, nom, prenom, vehicule, objet, email, message } = req.body || {};

  if (!nom || !prenom || !objet || !message) {
    return badRequest(res, 'Merci de remplir les champs obligatoires');
  }

  try {
    await pool.query(
      `INSERT INTO messages_contact (statut, nom, prenom, vehicule, objet, email, message)
       VALUES (?,?,?,?,?,?,?)`,
      [
        statut || null,
        String(nom).trim(),
        String(prenom).trim(),
        vehicule ? String(vehicule).trim() : null,
        String(objet).trim(),
        email ? String(email).trim().toLowerCase() : null,
        String(message).trim()
      ]
    );
    return res.status(201).json({ message: 'Message envoyé. Merci !' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =========================
// Fallback to index (simple SPA feel)
// =========================
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(PORT, () => {
  console.log(`✅ EcoRide running on http://localhost:${PORT}`);
});
