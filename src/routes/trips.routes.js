import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { date, depart, destination, places, elle } = req.query;

    const where = [];
    const params = [];

    if (date) {
      where.push('t.date_trajet = ?');
      params.push(date);
    }
    if (depart) {
      where.push('t.depart = ?');
      params.push(depart);
    }
    if (destination) {
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
        t.places_total,
        t.places_restantes,
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

    const [rows] = await pool.query(sql, params);
    res.json({ trips: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:id/reserve', requireAuth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const tripId = Number(req.params.id);
    const places = Number(req.body.places || 1);

    if (!tripId || places < 1) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    // Only passengers can reserve
    if (req.user.role !== 'passager') {
      return res.status(403).json({ error: 'Seuls les passagers peuvent réserver' });
    }

    await conn.beginTransaction();

    const [tripRows] = await conn.query(
      'SELECT id, places_restantes FROM trajets WHERE id = ? FOR UPDATE',
      [tripId]
    );

    if (!tripRows.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Trajet introuvable' });
    }

    const trip = tripRows[0];
    if (trip.places_restantes < places) {
      await conn.rollback();
      return res.status(400).json({ error: 'Plus assez de places disponibles' });
    }

    await conn.query(
      'UPDATE trajets SET places_restantes = places_restantes - ? WHERE id = ?',
      [places, tripId]
    );

    const [resInsert] = await conn.query(
      'INSERT INTO reservations (trajet_id, passager_id, places_reservees, statut) VALUES (?,?,?,?)',
      [tripId, req.user.id, places, 'en_attente']
    );

    await conn.commit();

    res.status(201).json({
      message: 'Réservation créée',
      reservationId: resInsert.insertId,
    });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

router.get('/mine/reservations', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.places_reservees, r.statut, r.created_at,
              t.depart, t.destination, t.date_trajet, t.heure_depart, t.prix
       FROM reservations r
       JOIN trajets t ON t.id = r.trajet_id
       WHERE r.passager_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({ reservations: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
