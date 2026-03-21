import path from 'path';
import Database from 'better-sqlite3';
import { app } from 'electron';
import { Schema } from './schema.js';
import { Queries } from './queries.js';
import { Seeds } from './seeds.js';

let db = null;
let schema = null;
let queries = null;
let seeds = null;

try {
    // Chemin de la base de données
    const dbPath = path.join(app.getPath('userData'), 'bongisakisi.db');
    
    // Connexion à la base de données
    db = new Database(dbPath);

    // Initialisation des classes
    schema = new Schema(db);
    queries = new Queries(db);
    seeds = new Seeds(db);

    // Création automatique des tables au démarrage
    schema.createTables();

    // Insertion des données par défaut si première exécution
    seeds.seedDefaultData();
    
    console.log('Base de données initialisée avec succès');

} catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
}

// Export des instances (peuvent être null si erreur)
export { db, schema, queries, seeds };

// Export par défaut pour compatibilité
export default {
    db,
    schema,
    queries,
    seeds
};