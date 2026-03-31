import { queries } from './../models/index.js'
import log from 'electron-log';
import { Text } from '../utils/text.js';

class ProduitController {

    constructor() {
        this.queries = queries;
    }

    get() {
        try {
            const data = this.queries.join(
                {
                    from: "medicaments",
                    columns: `
                        medicaments.id,
                        medicaments.name as medicament_name,
                        medicaments.stock,
                        medicaments.last_stock,
                        medicaments.price_buy,
                        medicaments.price_sell,
                        medicaments.date_expiration,
                        families.name as family_name,
                        families.id as family_id
                    `,
                    join: {
                        table: "families",
                        on: "medicaments.family_id = families.id"
                    },
                    orderBy: 'medicaments.id',
                    order: 'DESC'
                }
            );
            return {
                success: true,
                data: data
            }
        } catch (error) {
            log.error('Error getting products:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    add(data) {
        try {
            
            const verify = this.queries.findOne('medicaments', { name: Text.capitalize(data.name) })
            if(verify) {
                log.warn('le nom du produit existe déjà:', data.name);
                return { success: false, error: 'Le nom du produit existe déjà' }
            } else {
                this.queries.insert('medicaments', {
                    name: Text.capitalize(data.name),
                    family_id: data.family,
                    stock: data.quantite,
                    last_stock: data.quantite,
                    price_buy: data.prixAchat,
                    price_sell: data.prixVente,
                    date_expiration: data.dateExpiration
                })
                return { success: true}
            }
        } catch (error) {
            log.error('Error adding family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    update(data, id) {
        try {
            const verify = this.queries.findOne('medicaments', { name: Text.capitalize(data.name) })
                if(verify && verify.id !== id) {
                    log.warn('le nom du produit existe déjà:', data.name);
                    return { success: false, error: 'Le nom du produit existe déjà' }
                } else {
                    this.queries.update('medicaments', 
                    {
                        name: Text.capitalize(data.name),
                        family_id: data.family,
                        price_buy: data.prixAchat,
                        price_sell: data.prixVente
                    }, { id: id })
                    
                    return { success: true}
                }
        } catch (error) {
            log.error('Error updating product:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    delete(id) {
        try {
            this.queries.delete('medicaments', { id: id })
            return { success: true}
        } catch (error) {
            log.error('Error deleting product:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    addStock(data) {
        try {
            const old = this.queries.findOne('medicaments', { id: data.id })
            const newStock = Number(old.stock) + Number(data.quantite)

            this.queries.update('medicaments', 
            {
                stock: newStock,
                last_stock: newStock
            }, { id: data.id })
            
            return { success: true}
        } catch (error) {
            log.error('Error adding stock:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    updateExpiry(data) {
        try {
            this.queries.update('medicaments', 
            {
                date_expiration: data.nouvelleDate
            }, { id: data.id })
            
            return { success: true}
        } catch (error) {
            log.error('Error updating expiry:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const produitController = new ProduitController();