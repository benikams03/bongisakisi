export class Seeds {
    constructor(db) {
        this.db = db;
    }

    // ---------- Vérifier si c'est la première exécution ----------
    isFirstRun() {
        const medicamentsCount = this.db.prepare("SELECT COUNT(*) as count FROM medicaments").get().count;
        return medicamentsCount === 0;
    }

    // ---------- Insérer les données par défaut ----------
    async seedDefaultData() {
        if (!this.isFirstRun()) {
            console.log('Base de données déjà initialisée');
            return;
        }

        try {

            // Insérer les clients par défaut
            const families = [
                { name: 'Antibiotiques' },
                { name: 'Antalgiques' },
                { name: 'Antipaludiques' },
                { name: 'Anti-inflammatoires' },
                { name: 'Vitamines & fortifiants' },
                { name: 'Digestifs' },
                { name: 'Matériel médical' }
            ];

            families.forEach(family => {
                this.db.prepare(`
                    INSERT OR IGNORE INTO families (name) 
                    VALUES (@name)
                `).run(family);
            });


            console.log('Données par défaut insérées avec succès');

        } catch (error) {
            console.error('Erreur lors de l\'initialisation des données:', error);
            throw error;
        }
    }
}
