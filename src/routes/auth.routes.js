import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db.js';
import { requireAuth } from '../middlewares/auth.js';

dotenv.config();

const router = Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      sexe: user.sexe,
    },
    secret,
    { expiresIn }
  );
}

router.post('/register', async (req, res) => {
  try {
    const {
      role = 'passager',
      sexe,
      nom,
      prenom,
      age,
      email,
      telephone,
      password,
      vehicule = 'aucun',
      marque = null,
      modele = null,
      annee = null,
      energie_vehicule = null,
      immatriculation = null,
    } = req.body;

    if (!sexe || !nom || !prenom || !age || !email || !telephone || !password) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    if (!['conducteur', 'passager'].includes(role)) {
      return res.status(400).json({ error: 'Role invalide' });
    }

    // Driver must have a car
    const finalVehicule = role === 'conducteur' ? 'voiture' : 'aucun';

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO utilisateurs
      (role,sexe,nom,prenom,age,email,telephone,mot_de_passe,vehicule,marque,modele,annee,energie_vehicule,immatriculation)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        role,
        sexe,
        nom,
        prenom,
        Number(age),
        email,
        telephone,
        hashed,
        finalVehicule,
        finalVehicule === 'voiture' ? marque : null,
        finalVehicule === 'voiture' ? modele : null,
        finalVehicule === 'voiture' ? (annee ? Number(annee) : null) : null,
        finalVehicule === 'voiture' ? energie_vehicule : null,
        finalVehicule === 'voiture' ? immatriculation : null,
      ]
    );

    const user = {
      id: result.insertId,
      role,
      sexe,
      nom,
      prenom,
      email,
    };

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (e) {
    // Duplicate keys
    if (String(e?.code).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'Email, téléphone ou immatriculation déjà utilisé' });
    }
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const [rows] = await pool.query(
      'SELECT id, role, sexe, nom, prenom, email, mot_de_passe FROM utilisateurs WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const userRow = rows[0];
    const ok = await bcrypt.compare(password, userRow.mot_de_passe);
    if (!ok) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = {
      id: userRow.id,
      role: userRow.role,
      sexe: userRow.sexe,
      nom: userRow.nom,
      prenom: userRow.prenom,
      email: userRow.email,
    };

    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, role, sexe, nom, prenom, age, email, telephone, vehicule, marque, modele, annee, energie_vehicule, immatriculation FROM utilisateurs WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });

    res.json({ user: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
