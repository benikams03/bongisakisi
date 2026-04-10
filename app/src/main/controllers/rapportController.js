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


    getStatDashbord(choix) {
        try {
            const paniersQuery = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : ''}
            `);
            const paniersQuery_old = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : ''}
            `);
            
            const ventesDay = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : ''}
            `);
            const ventesDay_old = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : ''}
            `);
            
            const produitsDay = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : ''}
            `);
            const produitsDay_old = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : ''}
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
                    }
                }
            }

        } catch (error) {
            log.error('Error getting rapport:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du rapport'
            };
        }
    }


    getLowStockItems() {
        try {
            const lowStockItems = this.queries.raw(`
                SELECT *
                FROM medicaments
                WHERE stock < 10
            `)
            return {
                success: true,
                data: lowStockItems
            };
        } catch (error) {
            log.error('Error getting low stock items:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des stocks faibles'
            };
        }
    }

    getExpiredItems() {
        try {
            const expiredItems = this.queries.raw(`
                SELECT *
                FROM medicaments
                WHERE date_expiration < DATE('now')
            `)

            const expiringSoonItems = this.queries.raw(`
                SELECT *
                FROM medicaments
                WHERE date_expiration BETWEEN DATE('now') AND DATE('now', '+30 days')
            `)

            return {
                success: true,
                data: {
                    expired: expiredItems,
                    expiringSoon: expiringSoonItems
                }
            };
        } catch (error) {
            log.error('Error getting expired items:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des médicaments expirés'
            };
        }
    }

    getStatAdmin(choix) {

        try {

            const paniersQuery = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\') AND DATE(\'now\', \'start of month\', \'+1 month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\') AND DATE(\'now\', \'start of year\', \'+1 year\', \'-1 day\')' : 
                    ''  }
            `);
            const paniersQuery_old = this.queries.raw(`
                SELECT DISTINCT panier as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\', \'-1 month\') AND DATE(\'now\', \'start of month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\', \'-1 year\') AND DATE(\'now\', \'start of year\', \'-1 day\')' : 
                    ''}
            `);
            
            const ventesDay = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\') AND DATE(\'now\', \'start of month\', \'+1 month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\') AND DATE(\'now\', \'start of year\', \'+1 year\', \'-1 day\')' : 
                    ''  }
            `);
            const ventesDay_old = this.queries.raw(`
                SELECT SUM(price_total) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\', \'-1 month\') AND DATE(\'now\', \'start of month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\', \'-1 year\') AND DATE(\'now\', \'start of year\', \'-1 day\')' : 
                    ''}
            `);
            
            const produitsDay = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\') AND DATE(\'now\', \'start of month\', \'+1 month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\') AND DATE(\'now\', \'start of year\', \'+1 year\', \'-1 day\')' : 
                    ''  }
            `);
            const produitsDay_old = this.queries.raw(`
                SELECT SUM(quantity) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\', \'-1 month\') AND DATE(\'now\', \'start of month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\', \'-1 year\') AND DATE(\'now\', \'start of year\', \'-1 day\')' : 
                    ''}
            `);
            
            const gainDay = this.queries.raw(`
                SELECT SUM(price_benefit) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\') AND DATE(\'now\', \'start of month\', \'+1 month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\') AND DATE(\'now\', \'start of year\', \'+1 year\', \'-1 day\')' : 
                    ''  }
            `);
            const gainsDay_old = this.queries.raw(`
                SELECT SUM(price_benefit) as total
                FROM orders
                WHERE status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\', \'-1 day\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-13 days\') AND DATE(\'now\', \'weekday 0\', \'-7 days\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\', \'-1 month\') AND DATE(\'now\', \'start of month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\', \'-1 year\') AND DATE(\'now\', \'start of year\', \'-1 day\')' : 
                    ''}
            `);


            // ------------------------------------------------------

            const topVentes = this.queries.raw(`
                SELECT 
                    medicaments.name as name,
                    SUM(orders.quantity) as quantiteTotale,
                    SUM(orders.price_total) as totalVentes,
                    medicaments.stock as stock
                FROM orders
                LEFT JOIN medicaments ON orders.id_medoc = medicaments.id
                WHERE orders.status = 'confirmed' 
                ${ choix === 'day' ? 
                    'AND DATE(datecreate) = DATE(\'now\')' : 
                    choix === 'week' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'weekday 0\', \'-6 days\') AND DATE(\'now\', \'weekday 0\')' : 
                    choix === 'month' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of month\') AND DATE(\'now\', \'start of month\', \'+1 month\', \'-1 day\')' : 
                    choix === 'year' ? 
                    'AND DATE(datecreate) BETWEEN DATE(\'now\', \'start of year\') AND DATE(\'now\', \'start of year\', \'+1 year\', \'-1 day\')' : 
                    ''  }
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
                        gainDay: gainDay[0].total || 0,
                    },
                    stats_old : {
                        commandeDay: paniersQuery_old.length,
                        produitDay: produitsDay_old[0].total || 0,
                        ventesDay: ventesDay_old[0].total || 0,
                        gainDay: gainsDay_old[0].total || 0,
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