import { queries } from './../models/index.js'

export class FamilieController {

    constructor() {
        this.queries = queries;
    }

    getDefault() {
        try {
            // Requête SQL directe pour LEFT JOIN avec COUNT
            const sql = `
                SELECT 
                    f.id,
                    f.name,
                    f.date_creation,
                    f.defaults,
                    COUNT(m.id) as medicament_count
                FROM families f
                LEFT JOIN medicaments m ON f.id = m.family_id
                WHERE f.defaults = 1
                GROUP BY f.id, f.name, f.date_creation, f.defaults
                ORDER BY f.name ASC
            `;
            
            const data = this.queries.db.prepare(sql).all();
            
            return {
                success: true,
                data: data
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

}