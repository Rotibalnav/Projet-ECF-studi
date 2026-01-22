import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const {
      statut,
      nom,
      prenom,
      vehicule = null,
      objet,
      email = null,
      message,
    } = req.body;

    if (!statut || !nom || !prenom || !objet || !message) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    await pool.query(
      `INSERT INTO messages_contact
        (statut, nom, prenom, vehicule, objet, email, message)
       VALUES (?,?,?,?,?,?,?)`,
      [statut, nom, prenom, vehicule, objet, email, message]
    );

    res.status(201).json({ message: 'Message envoyé' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
