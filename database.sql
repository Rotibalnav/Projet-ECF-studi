CREATE DATABASE Ecoride;

USE Ecoride;

CREATE TABLE Utilisateurs (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    sexe CHAR(1) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(15) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    vehicule ENUM('voiture') NOT NULL,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    annee INT NOT NULL,
    energie_vehicule ENUM(
        'thermique',
        'hybride',
        'electrique'
    ) NOT NULL matriculation VARCHAR(20) NOT NULL UNIQUE,
);

INSERT INTO
    Utilisateurs (
        sexe,
        nom,
        prenom,
        age,
        email,
        telephone,
        mot_de_passe,
        date_inscription,
        vehicule,
        marque,
        modele,
        annee,
        energie_vehicule,
        matriculation
    )
VALUES (
        'M',
        'Doe',
        'John',
        22,
        'john.doe@example.com',
        '0123456789',
        'password123',
        '12-05-2024 09:24:00',
        'voiture',
        'Toyota',
        'Corolla',
        2020,
        'thermique',
        'ABC123'
    ),
    (
        'M',
        'Johnson',
        'Alex',
        21,
        'alex.johnson@example.com',
        '0123456789',
        'password234',
        '15-05-2024 09:30:00',
        'voiture',
        'Ford',
        'Fiesta',
        2019,
        'hybride',
        'DEF234'
    ),
    (
        'F',
        'Smith',
        'Jane',
        24,
        'jane.smith@example.com',
        '0123456789',
        'password456',
        '14-01-2024 10:00:00',
        'voiture',
        'Honda',
        'Civic',
        2019,
        'hybride',
        'XYZ789'
    ),
    (
        'M',
        'Brown',
        'Mike',
        23,
        'mike.brown@example.com',
        '0123456789',
        'password789',
        '11-08-2024 10:00:00',
        'voiture',
        'Ford',
        'Focus',
        2021,
        'thermique',
        'DEF456'
    ),
    (
        'F',
        'Davis',
        'Emily',
        25,
        'emily.davis@example.com',
        '0123456789',
        'password101',
        '04-02-2024 10:00:00',
        'voiture',
        'Chevrolet',
        'Malibu',
        2020,
        'hybride',
        'GHI789'
    ),
    (
        'M',
        'Wilson',
        'Chris',
        26,
        'chris.wilson@example.com',
        '0123456789',
        'password202',
        '02-06-2024 10:00:00',
        'voiture',
        'Nissan',
        'Altima',
        2021,
        'electrique',
        'JKL012'
    ),
    (
        'F',
        'Taylor',
        'Jessica',
        27,
        'jessica.taylor@example.com',
        '0123456789',
        'password303',
        '06-08-2024 10:00:00',
        'voiture',
        'Hyundai',
        'Elantra',
        2020,
        'thermique',
        'MNO345'
    ),
    (
        'M',
        'Garcia',
        'David',
        28,
        'david.garcia@example.com',
        '0123456789',
        'password404',
        '07-07-2024 10:00:00',
        'voiture',
        'Kia',
        'Optima',
        2021,
        'hybride',
        'PQR678'
    ),
    (
        'F',
        'Martinez',
        'Sophia',
        29,
        'sophia.martinez@example.com',
        '0123456789',
        'password505',
        '30-04-2024 10:00:00',
        'voiture',
        'Mazda',
        'CX-5',
        2020,
        'thermique',
        'STU901'
    ),
    (
        'M',
        'Hernandez',
        'James',
        30,
        'james.hernandez@example.com',
        '0123456789',
        'password606',
        '25-03-2024 10:00:00',
        'voiture',
        'Subaru',
        'Outback',
        2021,
        'electrique',
        'VWX234'
    ),
    (
        'F',
        'Lopez',
        'Isabella',
        31,
        'isabella.lopez@example.com',
        '0123456789',
        'password707',
        '20-02-2024 10:00:00',
        'voiture',
        'Volkswagen',
        'Golf',
        2020,
        'thermique',
        'YZA567'
    ),
    (
        'M',
        'Gonzalez',
        'Daniel',
        32,
        'daniel.gonzalez@example.com',
        '0123456789',
        'password808',
        '18-01-2024 10:00:00',
        'voiture',
        'Chevrolet',
        'Malibu',
        2020,
        'hybride',
        'BCD678'
    ),
    (
        'F',
        'Perez',
        'Mia',
        33,
        'mia.perez@example.com',
        '0123456789',
        'password909',
        '22-03-2024 10:00:00',
        'voiture',
        'Toyota',
        'Camry',
        2020,
        'thermique',
        'EFG012'
    ),
    (
        'M',
        'Sanchez',
        'Ethan',
        34,
        'ethan.sanchez@example.com',
        '0123456789',
        'password010',
        '10-01-2024 10:00:00',
        'voiture',
        'Honda',
        'Accord',
        2020,
        'electrique',
        'HIJ345'
    ),
    (
        'F',
        'Skander',
        'Stella',
        22,
        'stella.skander@example.com',
        '0123456789',
        'password111',
        '05-05-2024 10:00:00',
        'voiture',
        'Nissan',
        'Sentra',
        2020,
        'thermique',
        'JKL456'
    ),
    (
        'M',
        'Nguyen',
        'Liam',
        23,
        'liam.nguyen@example.com',
        '0123456789',
        'password222',
        '12-12-2024 10:00:00',
        'voiture',
        'Toyota',
        'Camry',
        2020,
        'electrique',
        'MNO678'
    ),
    (
        'F',
        'King',
        'Fabienne',
        24,
        'fabienne.king@example.com',
        '0123456789',
        'password333',
        '15-11-2024 10:00:00',
        'voiture',
        'Peugeot',
        '308',
        2020,
        'thermique',
        'PQR789'
    ),
    (
        'M',
        'Wright',
        'Noah',
        25,
        'noah.wright@example.com',
        '0123456789',
        'password444',
        '20-10-2024 10:00:00',
        'voiture',
        'Tesla',
        'Model 3',
        2020,
        'electrique',
        'STU012'
    ),
    (
        'F',
        'Lopez',
        'Chloe',
        26,
        'chloe.lopez@example.com',
        '0123456789',
        'password555',
        '25-09-2024 10:00:00',
        'voiture',
        'BMW',
        'X3',
        2020,
        'thermique',
        'VWX345'
    ),
    (
        'M',
        'Hill',
        'Mason',
        27,
        'mason.hill@example.com',
        '0123456789',
        'password666',
        '30-08-2024 10:00:00',
        'voiture',
        'Audi',
        'A4',
        2020,
        'electrique',
        'YZA678'
    );

INSERT INTO
    Utilisateurs (
        sexe,
        nom,
        prenom,
        age,
        email,
        telephone,
        mot_de_passe,
        date_inscription,
        vehicule,
        marque,
        modele,
        annee,
        energie_vehicule,
        matriculation
    )
VALUES (
        'M',
        'lourmel',
        'Joshua',
        22,
        'joshua.lourmel@example.com',
        'password123',
        '12-05-2024 09:24:00',
        'voiture',
        'Mercedes',
        'Classe GLE',
        2020,
        'hybride',
        'ABC123'
    );

SELECT * FROM Utilisateurs;

SELECT Nom, Prénom, email FROM Utilisateurs;

SELECT * FROM Utilisateurs WHERE age > 21;

SELECT Nom, Prénom, email, vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'electrique';

SELECT Nom, Prénom, email, vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'thermique';

SELECT Nom, Prénom, email, vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'hybride';

UPDATE Utilisateurs SET sexe = 'F' WHERE Id = 1;

UPDATE Utilisateurs SET sexe = 'M' WHERE Id = 2;

UPDATE Utilisateurs SET telephone = '0987654321' WHERE Id = 2;

UPDATE vehicule SET marque = 'Renault' WHERE Id = 3;

DELETE FROM Utilisateurs WHERE Id = 4;

DELETE FROM vehicule WHERE Id = 4;

DROP DATABASE Ecoride;