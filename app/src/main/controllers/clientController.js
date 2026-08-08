import { queries } from '../models/index.js'
import log from 'electron-log';
import { Text } from '../utils/text.js';


class ClientController {

    constructor() {
        this.queries = queries;
    }

    getClient() {
        try {
            const clients = this.queries.raw(`
                SELECT 
                    clients.id as id,
                    clients.name as name,
                    COALESCE(SUM(orders.price_total), 0) as total_debt
                FROM clients
                LEFT JOIN orders ON clients.id = orders.id_client AND orders.status = 'debt'
                GROUP BY clients.id, clients.name
                HAVING total_debt > 0
                ORDER BY total_debt DESC
            `);

            return {
                success: true,
                data: clients
            };
        } catch (error) {
            log.error('Error getting clients with debts:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des clients'
            };
        }
    }

    getClientCommands(clientId) {
        try {
            const commands = this.queries.raw(`
                SELECT 
                    orders.panier as id,
                    orders.datecreate as date,
                    orders.price_total as total,
                    orders.id as order_id,
                    medicaments.name as name,
                    orders.quantity as quantity,
                    orders.price_total as total
                FROM orders
                LEFT JOIN medicaments ON orders.id_medoc = medicaments.id
                WHERE orders.id_client = ${clientId}
                AND orders.status = 'debt'
                ORDER BY orders.datecreate DESC
            `);

            // Group by panier
            const groupedCommands = {};
            commands.forEach(cmd => {
                if (!groupedCommands[cmd.id]) {
                    groupedCommands[cmd.id] = {
                        id: cmd.id,
                        date: cmd.date,
                        total: 0,
                        medicaments: []
                    };
                }
                groupedCommands[cmd.id].total += cmd.total;
                groupedCommands[cmd.id].medicaments.push({
                    id: cmd.order_id,
                    name: cmd.name,
                    quantity: cmd.quantity,
                    price: cmd.total / cmd.quantity,
                    total: cmd.total
                });
            });

            return {
                success: true,
                data: Object.values(groupedCommands)
            };
        } catch (error) {
            log.error('Error getting client commands:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des commandes'
            };
        }
    }

    validateDebtPayment(data) {
        try {
            const { panierId } = data;
            
            log.info('Validating debt payment for panier:', panierId);
            
            // Update all orders in this panier from 'debt' to 'confirmed' using run() for UPDATE
            const result = this.queries.run(`
                UPDATE orders 
                SET status = 'confirmed', dette = 0 
                WHERE panier = ${panierId} AND status = 'debt'
            `);
            
            log.info('Update result:', result);

            return {
                success: true,
                message: 'Paiement validé avec succès'
            };
        } catch (error) {
            log.error('Error validating debt payment:', error);
            return {
                success: false,
                error: 'Erreur lors de la validation du paiement'
            };
        }
    }


}

export const clientController = new ClientController();