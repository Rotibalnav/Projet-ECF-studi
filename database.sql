CREATE DATABASE Ecoride;

USE Ecoride;

--CREATION DE LA TABLE UTILISATEURS
CREATE TABLE Utilisateurs (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    sexe CHAR(1) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(15) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    vehicule VARCHAR(20) NOT NULL CHECK (vehicule IN ('voiture')),
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    annee INT NOT NULL,
    energie_vehicule VARCHAR(20) NOT NULL CHECK (energie_vehicule IN ('thermique','hybride','electrique')),
    matriculation VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO
    utilisateurs (
        sexe,
        nom,
        prenom,
        age,
        email,
        telephone,
        mot_de_passe,
        vehicule,
        marque,
        modele,
        annee,
        energie_vehicule,
        matriculation
    )
VALUES (
        'M',
        'Johnson',
        'Alex',
        21,
        'alex.johnson@example.com',
        '0123456789',
        'password234',
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
        '0173456789',
        'password456',
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
        '022456789',
        'password789',
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
        '0323456789',
        'password101',
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
        '0423456789',
        'password202',
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
        '0523456789',
        'password303',
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
        '0623456789',
        'password404',
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
        '0123456779',
        'password505',
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
        '0123458789',
        'password606',
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
        '0123459789',
        'password707',
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
        '0123456189',
        'password808',
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
        '0123116789',
        'password909',
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
        '0121256789',
        'password010',
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
        '0121356789',
        'password111',
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
        '0114456789',
        'password222',
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
        '0123451589',
        'password333',
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
        '0123166789',
        'password444',
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
        '0123176789',
        'password555',
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
        '0123418789',
        'password666',
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
        '0145456789',
        'password123',
        'voiture',
        'Mercedes',
        'Classe GLE',
        2020,
        'hybride',
        'ABC123'
    );

SELECT * FROM Utilisateurs;

SELECT nom, prenom, email FROM Utilisateurs;

SELECT * FROM Utilisateurs WHERE age > 21;

SELECT
    nom,
    prenom,
    email,
    energie_vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'electrique';

SELECT
    nom,
    prenom,
    email,
    energie_vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'thermique';

SELECT
    nom,
    prenom,
    email,
    energie_vehicule
FROM Utilisateurs
WHERE
    energie_vehicule = 'hybride';

UPDATE Utilisateurs SET sexe = 'F' WHERE ID = 1;

UPDATE Utilisateurs SET sexe = 'M' WHERE ID = 2;

UPDATE Utilisateurs SET telephone = '0987654321' WHERE ID = 2;

UPDATE Utilisateurs SET marque = 'Renault' WHERE ID = 3;

DELETE FROM Utilisateurs WHERE ID = 4;

DROP DATABASE Ecoride;