import { queries } from './../models/index.js'
import log from 'electron-log';


class OrderController {

    constructor() {
        this.queries = queries;
    }

    getPanier() {
        try {
            const data = this.queries.join(
                {
                    from: "orders",
                    columns: `
                        orders.id as id,
                        orders.id_medoc,
                        orders.quantity,
                        orders.price_total,
                        orders.panier,
                        orders.datecreate,
                        orders.status as status,
                        medicaments.name as name
                    `,
                    join: {
                        table: "medicaments",
                        on: "orders.id_medoc = medicaments.id"
                    },
                    where : {
                        status: 'pending'
                    },
                    orderBy: 'orders.id',
                    order: 'ASC'
                }
            );
            return {
                success: true,
                data: data
            };
        } catch (error) {
            log.error('Error getting panier:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du panier'
            };
        }
    }

    addPanier(data){
        try {

            const verified = this.queries.findOne('medicaments', {
                id: data.medicament_id,
            })

            if (verified.stock === 0) {
                return {
                    success: false,
                    error: 'Stock épuisé'
                };
            } else {
                
                const verified_panier = this.queries.findOne('orders', {
                    id_medoc: data.medicament_id,
                    status: 'pending'
                });

                if (verified_panier) {

                    this.queries.update('orders', {
                        quantity: verified_panier.quantity + 1,
                        price_total: verified_panier.price_total + verified.price_sell,
                        price_benefit: verified_panier.price_benefit + (verified.price_sell - verified.price_buy)
                    }, 
                    { id: verified_panier.id })

                    this.queries.update('medicaments', {
                        stock: verified.stock - 1
                    }, 
                    { id: verified.id })

                    return {
                        success: true,
                        message: 'Medicament added to panier'
                    };

                }else {
                    const is_last_panier = this.queries.raw(`
                        SELECT MAX(panier) AS lastPanier
                        FROM orders
                        WHERE status != 'pending'
                    `)

                    this.queries.insert('orders', {
                        id_medoc: data.medicament_id,
                        quantity: 1,
                        price_total: verified.price_sell,
                        price_benefit: verified.price_sell - verified.price_buy,
                        panier: is_last_panier[0].lastPanier === null ? 1 : is_last_panier[0].lastPanier + 1,
                        status: 'pending'
                    });

                    this.queries.update('medicaments', {
                        stock: verified.stock - 1
                    }, 
                    { id: verified.id })

                    return {
                        success: true,
                        message: 'Medicament added to panier'
                    };
                }
            }

        } catch (error) {
            log.error('Error adding panier:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'ajout du panier'
            };
        }
    }

    removePanier(data) {
        try {

            const getpanier = this.queries.findOne('orders', {
                id_medoc: data.medicament_id,
                status: 'pending'
            });

            const verified = this.queries.findOne('medicaments', {
                id: data.medicament_id
            });
            
            if(getpanier.quantity === 1) {
                // Supprimer le panier
                this.queries.delete('orders', {
                    id_medoc: data.medicament_id,
                    status: 'pending'
                });

                this.queries.update('medicaments', {
                    stock: verified.stock + 1
                }, 
                { id: getpanier.id_medoc })

                return {
                    success: true,
                    message: 'Panier supprimé'
                };

            } else {
                // Diminuer la quantité
                this.queries.update('orders', {
                    quantity: getpanier.quantity - 1,
                    price_total: getpanier.price_total - verified.price_sell,
                    price_benefit: getpanier.price_benefit - (verified.price_sell - verified.price_buy)
                }, 
                { id: getpanier.id })

                this.queries.update('medicaments', {
                    stock: verified.stock + 1
                }, 
                { id: data.medicament_id })

                return {
                    success: true,
                    message: 'Medicament removed from panier'
                };
            }

        } catch (error) {
            log.error('Error removing panier:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression du panier'
            };
        }
    }

    removePanierDirect(data) {
        try {

            const getpanier = this.queries.findOne('orders', {
                id_medoc: data.medicament_id,
                status: 'pending'
            });

            const verified = this.queries.findOne('medicaments', {
                id: data.medicament_id
            });
            
            this.queries.update('medicaments', {
                stock: verified.stock + getpanier.quantity
            }, 
            { id: getpanier.id_medoc })
            
            this.queries.delete('orders', {
                id_medoc: data.medicament_id,
                status: 'pending'
            });

            return {
                success: true,
                message: 'Panier supprimé'
            };


        } catch (error) {
            log.error('Error removing panier:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression du panier'
            };
        }
    }

    confirmPanier() {
        try {
            // Récupérer d'abord le panier actuel
            const panierItems = this.queries.find('orders', { 
                status: 'pending' 
            });

            if (!panierItems || panierItems.length === 0) {
                return {
                    success: false,
                    error: 'Le panier est vide'
                };
            }

            // Mettre à jour uniquement les articles du panier actuel
            panierItems.forEach(item => {
                this.queries.update('orders', {
                    status: 'confirmed'
                }, { 
                    id: item.id 
                });
            });

            return {
                success: true,
                message: 'Panier confirmé'
            };

        } catch (error) {
            log.error('Error confirming panier:', error);
            return {
                success: false,
                error: 'Erreur lors de la confirmation du panier'
            };
        }
    }

    getPanierToday() {
        try {
            // Récupérer tous les paniers uniques sans pagination
            const paniersQuery = this.queries.raw(`
                SELECT DISTINCT panier
                FROM orders
                WHERE status != 'pending' 
                AND DATE(datecreate) = DATE('now')
                ORDER BY panier DESC
            `);

            // Pour chaque panier, récupérer tous les médicaments
            const panierItems = [];
            
            for (const panierRow of paniersQuery) {
                const medicaments = this.queries.raw(`
                    SELECT 
                        orders.id as id,
                        orders.id_medoc,
                        orders.quantity,
                        orders.price_total,
                        orders.panier,
                        orders.datecreate,
                        orders.status as status,
                        medicaments.name as name
                    FROM orders
                    LEFT JOIN medicaments ON orders.id_medoc = medicaments.id
                    WHERE orders.status != 'pending' 
                    AND DATE(orders.datecreate) = DATE('now')
                    AND orders.panier = ${panierRow.panier}
                    ORDER BY orders.datecreate DESC
                `);

                // Calculer le total pour ce panier
                const totalPanier = medicaments.reduce((sum, item) => sum + item.price_total, 0);

                panierItems.push({
                    panier: panierRow.panier,
                    datecreate: medicaments[0]?.datecreate,
                    medicaments: medicaments,
                    totalPanier: totalPanier,
                    nombreMedicaments: medicaments.length
                });
            }

            return {
                success: true,
                data: panierItems
            };

        } catch (error) {
            log.error('Error getting panier today:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du panier d\'aujourd\'hui'
            };
        }
    }

    annulerCommande(id) {
        try {

            const panierItems = this.queries.find('orders', { 
                panier: id 
            });

            panierItems.forEach(item => {
                
                this.queries.update('orders', {
                    status: 'cancelled'
                }, { 
                    id: item.id 
                });

                // recuperation du medoc
                const medoc = this.queries.findOne('medicaments', { 
                    id: item.id_medoc 
                });

                // Remettre le stock
                this.queries.update('medicaments', {
                    stock: medoc.stock + item.quantity
                }, { 
                    id: item.id_medoc 
                });
            });

            return {
                success: true,
                message: 'Commande annulée avec succès'
            };

        } catch (error) {
            log.error('Error cancelling command:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'annulation de la commande'
            };
        }
    }

}

export const orderController = new OrderController();