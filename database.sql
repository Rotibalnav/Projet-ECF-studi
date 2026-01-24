
/* Database: ecoride*/

DROP DATABASE IF EXISTS ecoride;

CREATE DATABASE ecoride
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecoride;

/* TABLE UTILISATEURS*/
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS trajets;
DROP TABLE IF EXISTS utilisateurs;

/* creation de la table utilisateurs */
CREATE TABLE utilisateurs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  role ENUM('conducteur','passager') NOT NULL DEFAULT 'passager',

  sexe ENUM('M','F') NOT NULL,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,

  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(20) NOT NULL UNIQUE,

/*Stocke un hash bcrypt (jamais un mot de passe en clair) */
  mot_de_passe VARCHAR(255) NOT NULL,

  /* Passager : vehicule = 'aucun', champs voiture = NULL */
  vehicule ENUM('voiture','aucun') NOT NULL DEFAULT 'aucun',
  marque VARCHAR(50) NULL,
  modele VARCHAR(50) NULL,
  annee SMALLINT UNSIGNED NULL,
  energie_vehicule ENUM('thermique','hybride','electrique') NULL,
  immatriculation VARCHAR(20) NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* création de la table trajets */

CREATE TABLE trajets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  conducteur_id INT UNSIGNED NOT NULL,

  date_trajet DATE NOT NULL,
  heure_depart TIME NULL,

  depart VARCHAR(120) NOT NULL,
  destination VARCHAR(120) NOT NULL,

  places_total TINYINT UNSIGNED NOT NULL DEFAULT 1,
  places_restantes TINYINT UNSIGNED NOT NULL DEFAULT 1,

  prix DECIMAL(10,2) NULL,
  commentaire VARCHAR(255) NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_trajets_conducteur
    FOREIGN KEY (conducteur_id) REFERENCES utilisateurs(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

/* création de la table reservations */

CREATE TABLE reservations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  trajet_id INT UNSIGNED NOT NULL,
  passager_id INT UNSIGNED NOT NULL,

  places_reservees TINYINT UNSIGNED NOT NULL DEFAULT 1,

  statut ENUM('en_attente','acceptee','refusee','annulee') NOT NULL DEFAULT 'en_attente',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_res_trajet
    FOREIGN KEY (trajet_id) REFERENCES trajets(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_res_passager
    FOREIGN KEY (passager_id) REFERENCES utilisateurs(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

/* création de la table messages_contact */

CREATE TABLE IF NOT EXISTS messages_contact (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  statut ENUM('passager','covoitureur') NULL,
  nom VARCHAR(60) NOT NULL,
  prenom VARCHAR(60) NOT NULL,
  vehicule VARCHAR(100) NULL,
  objet VARCHAR(120) NOT NULL,
  email VARCHAR(255) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* DONNÉES DE TEST
   - Hash bcrypt (mot de passe : password123)
   - 20 conducteurs + 20 passagers
*/

SET @PWD_HASH = '$2b$10$B3RFAALDOCaXQVl3pNrnve4Y2Xm97Q9TvXVj0islrwlgVynPBpLBu';

/* 20 CONDUCTEURS (avec voiture) */
INSERT INTO utilisateurs (
  role, sexe, nom, prenom, age, email, telephone, mot_de_passe,
  vehicule, marque, modele, annee, energie_vehicule, immatriculation
) VALUES
('conducteur','M','Johnson','Alex',21,'alex.johnson@example.com','0123456789',@PWD_HASH,'voiture','Ford','Fiesta',2019,'hybride','DEF234'),
('conducteur','F','Smith','Jane',24,'jane.smith@example.com','0173456789',@PWD_HASH,'voiture','Honda','Civic',2019,'hybride','XYZ789'),
('conducteur','M','Brown','Mike',23,'mike.brown@example.com','0223456789',@PWD_HASH,'voiture','Ford','Focus',2021,'thermique','DEF456'),
('conducteur','F','Davis','Emily',25,'emily.davis@example.com','0323456789',@PWD_HASH,'voiture','Chevrolet','Malibu',2020,'hybride','GHI789'),
('conducteur','M','Wilson','Chris',26,'chris.wilson@example.com','0423456789',@PWD_HASH,'voiture','Nissan','Altima',2021,'electrique','JKL012'),
('conducteur','F','Taylor','Jessica',27,'jessica.taylor@example.com','0523456789',@PWD_HASH,'voiture','Hyundai','Elantra',2020,'thermique','MNO345'),
('conducteur','M','Garcia','David',28,'david.garcia@example.com','0623456789',@PWD_HASH,'voiture','Kia','Optima',2021,'hybride','PQR678'),
('conducteur','F','Martinez','Sophia',29,'sophia.martinez@example.com','0123456779',@PWD_HASH,'voiture','Mazda','CX-5',2020,'thermique','STU901'),
('conducteur','M','Hernandez','James',30,'james.hernandez@example.com','0123458789',@PWD_HASH,'voiture','Subaru','Outback',2021,'electrique','VWX234'),
('conducteur','F','Lopez','Isabella',31,'isabella.lopez@example.com','0123459789',@PWD_HASH,'voiture','Volkswagen','Golf',2020,'thermique','YZA567'),
('conducteur','M','Gonzalez','Daniel',32,'daniel.gonzalez@example.com','0123456189',@PWD_HASH,'voiture','Chevrolet','Malibu',2020,'hybride','BCD678'),
('conducteur','F','Perez','Mia',33,'mia.perez@example.com','0123116789',@PWD_HASH,'voiture','Toyota','Camry',2020,'thermique','EFG012'),
('conducteur','M','Sanchez','Ethan',34,'ethan.sanchez@example.com','0121256789',@PWD_HASH,'voiture','Honda','Accord',2020,'electrique','HIJ345'),
('conducteur','F','Skander','Stella',22,'stella.skander@example.com','0121356789',@PWD_HASH,'voiture','Nissan','Sentra',2020,'thermique','JKL456'),
('conducteur','M','Nguyen','Liam',23,'liam.nguyen@example.com','0114456789',@PWD_HASH,'voiture','Toyota','Camry',2020,'electrique','MNO678'),
('conducteur','F','King','Fabienne',24,'fabienne.king@example.com','0123451589',@PWD_HASH,'voiture','Peugeot','308',2020,'thermique','PQR789'),
('conducteur','M','Wright','Noah',25,'noah.wright@example.com','0123166789',@PWD_HASH,'voiture','Tesla','Model 3',2020,'electrique','STU012'),
('conducteur','F','Lopez','Chloe',26,'chloe.lopez@example.com','0123176789',@PWD_HASH,'voiture','BMW','X3',2020,'thermique','VWX345'),
('conducteur','M','Hill','Mason',27,'mason.hill@example.com','0123418789',@PWD_HASH,'voiture','Audi','A4',2020,'electrique','YZA678'),
('conducteur','M','Lourmel','Joshua',22,'joshua.lourmel@example.com','0145456789',@PWD_HASH,'voiture','Mercedes','Classe GLE',2020,'hybride','ABC123');

/* 20 PASSAGERS (SANS voiture)*/
INSERT INTO utilisateurs (
  role, sexe, nom, prenom, age, email, telephone, mot_de_passe,
  vehicule, marque, modele, annee, energie_vehicule, immatriculation
) VALUES
('passager','M','Dupont','Karim',22,'passager01@ecoride.test','0700000001',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Martin','Sarah',21,'passager02@ecoride.test','0700000002',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Bernard','Yanis',25,'passager03@ecoride.test','0700000003',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Thomas','Ines',23,'passager04@ecoride.test','0700000004',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Petit','Mehdi',28,'passager05@ecoride.test','0700000005',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Robert','Lina',20,'passager06@ecoride.test','0700000006',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Richard','Nassim',26,'passager07@ecoride.test','0700000007',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Durand','Maya',24,'passager08@ecoride.test','0700000008',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Moreau','Ilyes',19,'passager09@ecoride.test','0700000009',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Simon','Amel',27,'passager10@ecoride.test','0700000010',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Laurent','Rayan',30,'passager11@ecoride.test','0700000011',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Lefevre','Chahinez',22,'passager12@ecoride.test','0700000012',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Michel','Adam',31,'passager13@ecoride.test','0700000013',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Garcia','Nour',18,'passager14@ecoride.test','0700000014',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Fournier','Anis',29,'passager15@ecoride.test','0700000015',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Roux','Yasmine',26,'passager16@ecoride.test','0700000016',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Vincent','Samy',24,'passager17@ecoride.test','0700000017',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Blanc','Aya',33,'passager18@ecoride.test','0700000018',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','M','Fontaine','Hugo',21,'passager19@ecoride.test','0700000019',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Chevalier','Selma',28,'passager20@ecoride.test','0700000020',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL),
('passager','F','Goarin','Typhaine',40,'goarintyphaine@ecoride.com','0700000021',@PWD_HASH,'aucun',NULL,NULL,NULL,NULL,NULL);

/* BONUS: 5 trajets de test créés par 5 conducteurs
   (ids 1..20 sont les conducteurs insérés plus haut) */

INSERT INTO trajets (
  conducteur_id, date_trajet, heure_depart,
  depart, destination, places_total, places_restantes,
  prix, commentaire
) VALUES
(1,'2026-01-22','08:30:00','Paris','Lille',3,3,15.00,'Trajet calme, pas de musique forte.'),
(2,'2026-01-22','14:00:00','Lyon','Grenoble',2,2,10.00,'Départ à l\'heure.'),
(3,'2026-01-23','09:15:00','Marseille','Nice',3,3,18.00,'Pause café possible.'),
(4,'2026-01-24','07:45:00','Toulouse','Bordeaux',4,4,22.00,'Voiture confortable.'),
(5,'2026-01-25','19:00:00','Nantes','Rennes',2,2,8.00,'Trajet rapide.'),
(6,'2026-01-26','12:30:00','Strasbourg','Metz',3,3,12.00,'Musique au choix.'),
(7,'2026-01-27','15:00:00','Montpellier','Perpignan',2,2,14.00,'Arrêt possible en route.'),
(8,'2026-01-28','10:00:00','Dijon','Besançon',3,3,11.00,'Trajet sans stress.'),
(9,'2026-01-29','13:30:00','Angers','Le Mans',4,4,9.00,'Voiture spacieuse.'),
(10,'2026-01-30','16:45:00','Clermont-Ferrand','Limoges',2,2,20.00,'Conduite prudente.'),
(11,'2026-01-31','11:15:00','Amiens','Rouen',3,3,13.00,'Trajet agréable.'),
(12,'2026-02-01','09:00:00','Caen','Le Havre',2,2,7.00,'Ponctuel et fiable.'),
(13,'2026-02-02','14:30:00','Nancy','Reims',4,4,16.00,'Bonne ambiance garantie.'),
(14,'2026-02-03','08:00:00','Tours','Orléans',3,3,10.00,'Voiture propre.'),
(15,'2026-02-04','17:15:00','Avignon','Nîmes',2,2,12.00,'Chauffeur sympathique.'),
(16,'2026-02-05','10:30:00','Poitiers','La Rochelle',3,3,15.00,'Trajet détendu.'),
(17,'2026-02-06','13:00:00','Valence','Gap',4,4,18.00,'Arrêt pour repas possible.'),
(18,'2026-02-07','07:30:00','Annecy','Chambéry',2,2,14.00,'Conduite sécurisée.'),
(19,'2026-02-08','15:45:00','Brest','Quimper',3,3,11.00,'Musique douce préférée.'),
(20,'2026-02-09','12:15:00','Ajaccio','Bastia',2,2,25.00,'Trajet en ferry inclus.'),
(21,'2026-01-24','18:00:00','Paris','Saint-tropez',3,3,20.00,'Trajet agréable.');

/* BONUS: 3 reservations de test (passagers ids 21..40) */

INSERT INTO reservations (trajet_id, passager_id, places_reservees, statut) VALUES
(1,21,1,'en_attente'),
(1,22,1,'acceptee'),
(2,23,1,'en_attente');

/* REQUÊTES DE TEST */

/* Compter conducteurs vs passagers */

SELECT role, COUNT(*) AS total
FROM utilisateurs
GROUP BY role;

/* Lister les trajets */

SELECT t.*, u.nom, u.prenom
FROM trajets t
JOIN utilisateurs u ON u.id = t.conducteur_id
ORDER BY t.date_trajet ASC;

/* Voir les reservations */

SELECT r.*, t.depart, t.destination, p.nom AS passager_nom, p.prenom AS passager_prenom
FROM reservations r
JOIN trajets t ON t.id = r.trajet_id
JOIN utilisateurs p ON p.id = r.passager_id
ORDER BY r.created_at DESC;
