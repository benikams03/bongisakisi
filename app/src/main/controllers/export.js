import { queries } from './../models/index.js'
import log from 'electron-log';
import { Text } from '../utils/text.js';

class ExportController {

    constructor() {
        this.queries = queries;
    }

    get(type, date) {
        try {
            let query = '';
            let groupBy = '';
            let whereClause = '';
            
            // Déterminer le GROUP BY et le WHERE selon le type
            switch(type) {
                case 'journalier':
                    groupBy = "strftime('%Y-%m-%d', datecreate)";
                    whereClause = `strftime('%Y-%m', datecreate) LIKE '${date}%'`;
                    break;
                case 'mensuel':
                    groupBy = "strftime('%Y-%m', datecreate)";
                    whereClause = `strftime('%Y', datecreate) LIKE '${date}%'`;
                    break;
                case 'annuel':
                    groupBy = "strftime('%Y', datecreate)";
                    whereClause = '1=1'; // Pas de filtre WHERE
                    break;
                default:
                    throw new Error('Type invalide. Utilisez: jour, mois, ou annee');
            }
            
            // Requête SQL pour obtenir les statistiques
            query = `
                SELECT 
                    ${groupBy} as periode,
                    SUM(price_total) as total_ventes,
                    SUM(price_benefit) as total_benefice,
                    (SUM(price_total) - SUM(price_benefit)) as capital,
                    SUM(quantity) as total_quantite,
                    COUNT(DISTINCT panier) as nombre_commandes
                FROM orders 
                WHERE ${whereClause}
                AND status = 'confirmed'
                GROUP BY ${groupBy}
                ORDER BY periode DESC
            `;
            
            // Exécuter la requête
            const result = this.queries.raw(query);
            
            return {
                success: true,
                data: result
            }
            
        } catch (error) {
            log.error('Erreur dans ExportController.get():', error);
            // En cas d'erreur, retourner des données fictives pour tester
            return {
                success: false,
                error: error.message
            }
        }
    }

    getBy(type, date) {
        try {
            let query = '';
            let groupBy = '';
            let whereClause = '';
            
            // Déterminer le GROUP BY et le WHERE selon le type
            switch(type) {
                case 'journalier':
                    groupBy = "strftime('%Y-%m-%d', datecreate)";
                    whereClause = `strftime('%Y-%m-%d', datecreate) = '${date}'`;
                    break;
                case 'mensuel':
                    groupBy = "strftime('%Y-%m', datecreate)";
                    whereClause = `strftime('%Y-%m', datecreate) = '${date}'`;
                    break;
                case 'annuel':
                    groupBy = "strftime('%Y', datecreate)";
                    whereClause = `strftime('%Y', datecreate) = '${date}'`;
                    break;
                default:
                    throw new Error('Type invalide. Utilisez: jour, mois, ou annee');
            }
            
            // Requête SQL pour obtenir les statistiques
            query = `
                SELECT 
                    ${groupBy} as periode,
                    SUM(price_total) as total_ventes,
                    SUM(price_benefit) as total_benefice,
                    (SUM(price_total) - SUM(price_benefit)) as capital,
                    SUM(quantity) as total_quantite,
                    COUNT(DISTINCT panier) as nombre_commandes
                FROM orders 
                WHERE ${whereClause}
                AND status = 'confirmed'
                GROUP BY ${groupBy}
                ORDER BY periode DESC
            `;
            
            // Exécuter la requête
            const result = this.queries.raw(query);

            // ================================================================================
            
            // Requête pour récupérer les détails des produits vendus selon la période
            let detailQuery = '';
            let detailWhereClause = '';
            
            // Déterminer le filtre selon le type pour les détails
            switch(type) {
                case 'journalier':
                    detailWhereClause = `strftime('%Y-%m-%d', o.datecreate) = '${date}'`;
                    break;
                case 'mensuel':
                    detailWhereClause = `strftime('%Y-%m', o.datecreate) = '${date}'`;
                    break;
                case 'annuel':
                    detailWhereClause = `strftime('%Y', o.datecreate) = '${date}'`;
                    break;
                default:
                    detailWhereClause = '1=1';
            }
            
            // Requête SQL pour les détails des produits avec jointures et regroupement
            detailQuery = `
                SELECT 
                    p.name as nom_produit,
                    f.name as categorie,
                    p.price_sell as prix_unitaire,
                    SUM(o.price_total) as prix_total_vendu,
                    SUM(o.quantity) as quantite_totale,
                    COUNT(DISTINCT o.panier) as nombre_commandes,
                    MIN(o.datecreate) as premiere_vente,
                    MAX(o.datecreate) as derniere_vente
                FROM orders o
                LEFT JOIN medicaments p ON o.id_medoc = p.id
                LEFT JOIN families f ON p.family_id = f.id
                WHERE ${detailWhereClause}
                AND o.status = 'confirmed'
                GROUP BY p.id, p.name, f.name, p.price_sell
                ORDER BY quantite_totale DESC, p.name ASC
            `;
            
            // Exécuter la requête des détails
            const detailResult = this.queries.raw(detailQuery);
            
            return {
                success: true,
                data: {
                    head: result,
                    body: detailResult
                }
            }
            
        } catch (error) {
            log.error('Erreur dans ExportController.get():', error);
            // En cas d'erreur, retourner des données fictives pour tester
            return {
                success: false,
                error: error.message
            }
        }

    }
    
}

export const exportController = new ExportController();