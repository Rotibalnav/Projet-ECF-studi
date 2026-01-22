# EcoRide (Projet ECF)

Projet de covoiturage écologique avec un **front HTML/CSS/JS** et un **backend Node.js + MySQL**.

## ✅ Technologies
- Front : HTML / CSS (Bootstrap 5) / JavaScript (ES Modules)
- Backend : Node.js / Express
- BDD : MySQL (phpMyAdmin)
- Sécurité : bcrypt (hash MDP) + JWT (authentification)

## 🚀 Installation (test local)

### 1) Base de données (phpMyAdmin)
1. Ouvrir phpMyAdmin
2. Importer le fichier : `database.sql`
3. Vérifier que la base s'appelle bien : **ecoride**

> Comptes de test : mot de passe **password123** (voir `database.sql`).

### 2) Backend Node.js
Dans le dossier du projet :

```bash
npm install
```

Créer un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Puis lancer le serveur :

```bash
npm start
```

➡️ Ouvrir : http://localhost:3000

## 🔥 API (principales routes)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/trips/search?...`
- `POST /api/trips/:id/reserve` (JWT)
- `POST /api/contact`

