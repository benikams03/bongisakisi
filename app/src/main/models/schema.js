import Database from 'better-sqlite3';

export class Schema {
    constructor(db) {
        this.db = db;
        this.expectedSchema = this.getExpectedSchema();
        this.migrateDatabase();
    }

    // ---------- Schéma attendu ----------
    getExpectedSchema() {
        return {
            medicaments: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                family_id: 'INTEGER NOT NULL',
                name: 'TEXT NOT NULL UNIQUE',
                stock: 'INTEGER DEFAULT 0',
                last_stock: 'INTEGER DEFAULT 0',
                price_buy: 'REAL DEFAULT 0',
                price_sell: 'REAL DEFAULT 0',
                date_expiration: 'DATE NOT NULL',
                date_creation: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
                FOREIGN_KEY: [
                    'FOREIGN KEY (family_id) REFERENCES families(id)'
                ]
            },
            families: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL UNIQUE',
                defaults: 'BOOLEAN DEFAULT 0',
                date_creation: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            },
            orders: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                id_medoc: 'INTEGER NOT NULL',
                quantity: 'INTEGER NOT NULL',
                price_total: 'REAL NOT NULL',
                price_benefit: 'REAL NOT NULL',
                panier: 'INTEGER NOT NULL',
                status: 'TEXT NOT NULL',
                datecreate: 'DATETIME DEFAULT (datetime(\'now\', \'localtime\'))',
                FOREIGN_KEY: [
                    'FOREIGN KEY (id_medoc) REFERENCES medicaments(id)'
                ]
            },
            notifications: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                type: 'TEXT NOT NULL UNIQUE',
                title: 'TEXT NOT NULL',
                message: 'TEXT NOT NULL',
                date_creation: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            },
            fournisseurs: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                name: 'TEXT NOT NULL UNIQUE',
                date_creation: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
            },
            acquisition: {
                id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                id_fournisseur: 'INTEGER NOT NULL',
                id_family: 'INTEGER NOT NULL',
                name_medoc: 'INTEGER NOT NULL',
                status: 'TEXT NOT NULL',
                datecreate: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
                FOREIGN_KEY: [
                    'FOREIGN KEY (id_fournisseur) REFERENCES fournisseurs(id) ON DELETE CASCADE',
                    'FOREIGN KEY (id_family) REFERENCES families(id) ON DELETE CASCADE'
                ]
            }
        };
    }

    // ---------- Migration de la base de données ----------
    migrateDatabase() {
        console.log('Début de la migration de la base de données...');
        
        // Créer la table de migration si elle n'existe pas
        this.createMigrationTable();
        
        // Obtenir la version actuelle de la base de données
        const currentVersion = this.getCurrentVersion();
        const targetVersion = this.getTargetVersion();
        
        console.log(`Version actuelle: ${currentVersion}, Version cible: ${targetVersion}`);
        
        if (currentVersion < targetVersion) {
            console.log('Migration nécessaire...');
            this.performMigration(currentVersion, targetVersion);
        } else {
            console.log('Base de données à jour');
        }
        
        // Vérifier et synchroniser le schéma
        this.syncSchema();
        
        console.log('Migration terminée');
    }

    // ---------- Création de la table de migration ----------
    createMigrationTable() {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
    }

    // ---------- Obtenir la version actuelle ----------
    getCurrentVersion() {
        const result = this.db.prepare('SELECT MAX(version) as version FROM schema_migrations').get();
        return result.version || 0;
    }

    // ---------- Obtenir la version cible ----------
    getTargetVersion() {
        return 1; // Version actuelle du schéma
    }

    // ---------- Effectuer la migration ----------
    performMigration(currentVersion, targetVersion) {
        for (let version = currentVersion + 1; version <= targetVersion; version++) {
            console.log(`Application de la migration v${version}`);
            
            try {
                // Créer les tables si elles n'existent pas
                this.createTables();
                
                // Marquer la migration comme appliquée
                this.db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version);
                console.log(`Migration v${version} appliquée avec succès`);
            } catch (error) {
                console.error(`Erreur lors de la migration v${version}:`, error);
                throw error;
            }
        }
    }

    // ---------- Synchroniser le schéma ----------
    syncSchema() {
        console.log('Synchronisation du schéma...');
        
        // Vérifier les tables existantes
        const existingTables = this.getExistingTables();
        const expectedTables = Object.keys(this.expectedSchema);
        
        // Ajouter les nouvelles tables
        for (const tableName of expectedTables) {
            if (!existingTables.includes(tableName)) {
                console.log(`Création de la nouvelle table: ${tableName}`);
                this.createTable(tableName);
            } else {
                // Vérifier les colonnes de la table existante
                this.syncTableColumns(tableName);
            }
        }
        
        // Supprimer les tables obsolètes (avec confirmation)
        for (const tableName of existingTables) {
            if (!expectedTables.includes(tableName)) {
                console.log(`Table obsolète détectée: ${tableName}`);
                // Optionnel: supprimer la table
                // this.dropTable(tableName);
            }
        }
    }

    // ---------- Obtenir les tables existantes ----------
    getExistingTables() {
        const result = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        return result.map(t => t.name);
    }

    // ---------- Créer une table ----------
    createTable(tableName) {
        const tableSchema = this.expectedSchema[tableName];
        const columns = [];
        const foreignKeys = [];
        
        for (const [columnName, definition] of Object.entries(tableSchema)) {
            if (columnName === 'FOREIGN_KEY') {
                foreignKeys.push(...definition);
            } else {
                columns.push(`${columnName} ${definition}`);
            }
        }
        
        const createSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')}${foreignKeys.length > 0 ? ', ' + foreignKeys.join(', ') : ''})`;
        
        try {
            this.db.prepare(createSQL).run();
            console.log(`Table ${tableName} créée avec succès`);
        } catch (error) {
            console.error(`Erreur lors de la création de la table ${tableName}:`, error);
            throw error;
        }
    }

    // ---------- Synchroniser les colonnes d'une table ----------
    syncTableColumns(tableName) {
        const expectedColumns = this.expectedSchema[tableName];
        const existingColumns = this.getTableColumns(tableName);
        
        // Ajouter les nouvelles colonnes
        for (const [columnName, definition] of Object.entries(expectedColumns)) {
            if (columnName === 'FOREIGN_KEY') continue;
            
            if (!existingColumns[columnName]) {
                console.log(`Ajout de la colonne ${tableName}.${columnName}`);
                this.addColumn(tableName, columnName, definition);
            } else {
                // Vérifier si la définition a changé
                if (this.hasColumnDefinitionChanged(existingColumns[columnName], definition)) {
                    console.log(`Modification de la colonne ${tableName}.${columnName}`);
                    this.modifyColumn(tableName, columnName, definition);
                }
            }
        }
        
        // Supprimer les colonnes obsolètes (SQLite ne supporte pas directement la suppression de colonnes)
        const obsoleteColumns = [];
        for (const columnName of Object.keys(existingColumns)) {
            if (!expectedColumns[columnName] && columnName !== 'FOREIGN_KEY') {
                console.log(`Colonne obsolète détectée: ${tableName}.${columnName}`);
                obsoleteColumns.push(columnName);
            }
        }
        
        // S'il y a des colonnes obsolètes, recréer la table
        if (obsoleteColumns.length > 0) {
            console.log(`Recréation de la table ${tableName} pour supprimer les colonnes: ${obsoleteColumns.join(', ')}`);
            this.recreateTableWithoutColumns(tableName, obsoleteColumns);
        }
    }

    // ---------- Obtenir les colonnes d'une table ----------
    getTableColumns(tableName) {
        const result = this.db.prepare(`PRAGMA table_info(${tableName})`).all();
        const columns = {};
        
        for (const column of result) {
            columns[column.name] = {
                type: column.type,
                notnull: column.notnull === 1,
                default_value: column.dflt_value,
                primary_key: column.pk === 1
            };
        }
        
        return columns;
    }

    // ---------- Ajouter une colonne ----------
    addColumn(tableName, columnName, definition) {
        try {
            // Extraire la définition de la colonne sans la valeur par défaut
            const columnType = this.extractColumnType(definition);
            const defaultValue = this.extractDefaultValue(definition);
            
            // Ajouter la colonne sans valeur par défaut si c'est non-constante
            let alterSQL = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
            
            if (this.isConstantDefault(defaultValue)) {
                alterSQL += ` DEFAULT ${defaultValue}`;
            }
            
            this.db.prepare(alterSQL).run();
            console.log(`Colonne ${tableName}.${columnName} ajoutée avec succès`);
            
            // Si la valeur par défaut est non-constante, mettre à jour les lignes existantes
            if (defaultValue && !this.isConstantDefault(defaultValue)) {
                this.updateColumnWithNonConstantDefault(tableName, columnName, defaultValue);
            }
            
        } catch (error) {
            console.error(`Erreur lors de l'ajout de la colonne ${tableName}.${columnName}:`, error);
            throw error;
        }
    }

    // ---------- Extraire le type de colonne ----------
    extractColumnType(definition) {
        // Extraire juste le type (INTEGER, TEXT, REAL, etc.)
        const match = definition.match(/^(INTEGER|TEXT|REAL|BOOLEAN|DATE|DATETIME)/i);
        return match ? match[1] : 'TEXT';
    }

    // ---------- Extraire la valeur par défaut ----------
    extractDefaultValue(definition) {
        // Extraire la valeur par défaut
        const match = definition.match(/DEFAULT\s+(.+?)(?:\s|$)/i);
        return match ? match[1] : null;
    }

    // ---------- Vérifier si la valeur par défaut est constante ----------
    isConstantDefault(defaultValue) {
        if (!defaultValue) return true;
        
        // Valeurs constantes: nombres, chaînes entre guillemets, NULL, CURRENT_TIMESTAMP
        return /^-?\d+(\.\d+)?$/.test(defaultValue) || 
               /^'.*'$/.test(defaultValue) || 
               /^NULL$/i.test(defaultValue) || 
               /^CURRENT_TIMESTAMP$/i.test(defaultValue);
    }

    // ---------- Mettre à jour la colonne avec une valeur par défaut non-constante ----------
    updateColumnWithNonConstantDefault(tableName, columnName, defaultValue) {
        try {
            let updateValue;
            
            if (defaultValue.includes('datetime(')) {
                updateValue = defaultValue;
            } else if (defaultValue.includes('date(')) {
                updateValue = defaultValue;
            } else {
                updateValue = defaultValue;
            }
            
            const updateSQL = `UPDATE ${tableName} SET ${columnName} = ${updateValue} WHERE ${columnName} IS NULL`;
            this.db.prepare(updateSQL).run();
            console.log(`Valeurs par défaut mises à jour pour ${tableName}.${columnName}`);
        } catch (error) {
            console.error(`Erreur lors de la mise à jour des valeurs par défaut pour ${tableName}.${columnName}:`, error);
            // Ne pas lancer d'erreur, l'ajout de colonne a réussi
        }
    }

    // ---------- Vérifier si la définition d'une colonne a changé ----------
    hasColumnDefinitionChanged(existingDef, expectedDef) {
        // Simplification: on vérifie juste le type pour l'instant
        const existingType = existingDef.type.toUpperCase();
        const expectedType = expectedDef.split(' ')[0].toUpperCase();
        
        return existingType !== expectedType;
    }

    // ---------- Recréer une table sans certaines colonnes ----------
    recreateTableWithoutColumns(tableName, columnsToRemove) {
        try {
            // Obtenir les colonnes à conserver
            const allColumns = this.getTableColumns(tableName);
            const columnsToKeep = Object.keys(allColumns).filter(col => !columnsToRemove.includes(col));
            
            // Créer une table temporaire avec les colonnes à conserver
            const tempTableName = `${tableName}_temp_${Date.now()}`;
            const tableSchema = this.expectedSchema[tableName];
            
            // Construire la définition des colonnes pour la nouvelle table
            const columnDefinitions = [];
            const foreignKeys = [];
            
            for (const [columnName, definition] of Object.entries(tableSchema)) {
                if (columnName === 'FOREIGN_KEY') {
                    foreignKeys.push(...definition);
                } else if (columnsToKeep.includes(columnName)) {
                    columnDefinitions.push(`${columnName} ${definition}`);
                }
            }
            
            const createTempSQL = `CREATE TABLE ${tempTableName} (${columnDefinitions.join(', ')}${foreignKeys.length > 0 ? ', ' + foreignKeys.join(', ') : ''})`;
            this.db.prepare(createTempSQL).run();
            
            // Copier les données de l'ancienne table vers la nouvelle
            const columnsToKeepStr = columnsToKeep.join(', ');
            const copySQL = `INSERT INTO ${tempTableName} (${columnsToKeepStr}) SELECT ${columnsToKeepStr} FROM ${tableName}`;
            this.db.prepare(copySQL).run();
            
            // Supprimer l'ancienne table
            this.db.prepare(`DROP TABLE ${tableName}`).run();
            
            // Renommer la table temporaire
            this.db.prepare(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`).run();
            
            console.log(`Table ${tableName} recréée avec succès, colonnes supprimées: ${columnsToRemove.join(', ')}`);
            
        } catch (error) {
            console.error(`Erreur lors de la recréation de la table ${tableName}:`, error);
            throw error;
        }
    }

    // ---------- Modifier une colonne (limité dans SQLite) ----------
    modifyColumn(tableName, columnName, definition) {
        // SQLite a des limitations pour ALTER COLUMN
        // On pourrait recréer la table si nécessaire
        console.log(`Modification de colonne non implémentée pour ${tableName}.${columnName}`);
    }

    // ---------- Supprimer une table ----------
    dropTable(tableName) {
        try {
            this.db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
            console.log(`Table ${tableName} supprimée avec succès`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la table ${tableName}:`, error);
            throw error;
        }
    }

    // ---------- Création des tables (méthode conservée pour compatibilité) ----------
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
                datecreate DATETIME DEFAULT (datetime('now', 'localtime')),

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
