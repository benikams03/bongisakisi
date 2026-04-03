import Database from 'better-sqlite3';

export class Schema {
    constructor(db) {
        this.db = db;
    }

    // ---------- Création des tables ----------
    createTables() {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS medicaments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                family_id INTEGER NOT NULL,
                name TEXT NOT NULL UNIQUE,
                stock INTEGER DEFAULT 0,
                last_stock INTEGER DEFAULT 0,
                price_buy REAL DEFAULT 0,
                price_sell REAL DEFAULT 0,
                date_expiration DATE NOT NULL,
                date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (family_id) REFERENCES families(id)
            )
        `).run();
        
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS families (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                defaults BOOLEAN DEFAULT 0,
                date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
        
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_medoc INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price_total REAL NOT NULL,
                price_benefit REAL NOT NULL,
                panier INTEGER NOT NULL,
                status TEXT NOT NULL,
                datecreate DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (id_medoc) REFERENCES medicaments(id)
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS fournisseurs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS acquisition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_fournisseur INTEGER NOT NULL,
                id_family INTEGER NOT NULL,
                name_medoc INTEGER NOT NULL,
                status TEXT NOT NULL,
                datecreate DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (id_fournisseur) REFERENCES fournisseurs(id) ON DELETE CASCADE,
                FOREIGN KEY (id_family) REFERENCES families(id) ON DELETE CASCADE
            )
        `).run();

        console.log('Tables créées avec succès');
    }

    // ---------- Vérifier si les tables existent ----------
    checkTables() {
        const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tableNames = tables.map(t => t.name);
        
        const requiredTables = [
            'medicaments', 'families', 'orders', 'notifications','fournisseurs', 'acquisition',
        ];
        const missingTables = requiredTables.filter(table => !tableNames.includes(table));
        
        if (missingTables.length > 0) {
            console.log('Tables manquantes:', missingTables);
            return false;
        }
        
        console.log('Toutes les tables existent');
        return true;
    }
}
