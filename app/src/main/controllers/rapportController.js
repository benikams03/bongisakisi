import { queries } from './../models/index.js'
import log from 'electron-log';


class RapportController {

    constructor() {
        this.queries = queries;
    }

    getStatCaissier() {

        try {

            const paniersQuery = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now')
            `);
            const paniersQuery_old = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now', '-1 day')
            `);
            
            const ventesDay = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now')
            `);
            const ventesDay_old = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now', '-1 day')
            `);
            
            const produitsDay = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now')
            `);
            const produitsDay_old = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                AND DATE(datecreate) = DATE('now', '-1 day')
            `);


            // ------------------------------------------------------

            const topVentes = this.queries.raw(`
                SELECT 
                    medicaments.name as name,
                    SUM(orders.quantity) as quantiteTotale,
                    SUM(orders.price_total) as totalVentes
                FROM orders
                LEFT JOIN medicaments ON orders.id_medoc = medicaments.id
                WHERE orders.status = 'confirmed' 
                AND DATE(orders.datecreate) = DATE('now')
                GROUP BY orders.id_medoc, medicaments.name
                ORDER BY quantiteTotale DESC
                LIMIT 10
            `);
            
            return {
                success: true,
                data: {
                    stats: {
                        commandeDay: paniersQuery.length,
                        produitDay: produitsDay[0].total || 0,
                        ventesDay: ventesDay[0].total || 0,
                    },
                    stats_old : {
                        commandeDay: paniersQuery_old.length,
                        produitDay: produitsDay_old[0].total || 0,
                        ventesDay: ventesDay_old[0].total || 0,
                    },
                    topVentes: topVentes
                }
            }

        }catch (error) {
            log.error('Error getting rapport:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du rapport'
            };
        }

    }

}

export const rapportController = new RapportController()