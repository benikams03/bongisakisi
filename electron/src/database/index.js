import { app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(app.getPath('userData'), 'app.db');
const db = new Database(dbPath)

db.exec(`

    CREATE TABLE IF NOT EXISTS medicament (
        idmed INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        categorieid INTEGER NOT NULL,
        date_expiration DATE NOT NULL,
        prix_achat REAL NOT NULL,
        prix_vente REAL NOT NULL,
        quantite INTEGER NOT NULL,
        statut TEXT NOT NULL,
        datecreate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categorieid) REFERENCES categorie(idcategorie)
    );

    CREATE TABLE IF NOT EXISTS notification (
        idnotif INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        details TEXT NOT NULL,
        datecreate DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achat (
        idachat INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        etat TEXT NOT NULL,
        prix_total REAL NOT NULL,
        benefice REAL NOT NULL,
        quantite INTEGER NOT NULL,
        panier INTEGER NOT NULL,
        datecreate DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categorie (
        idcategorie INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
    );

`)

export default db