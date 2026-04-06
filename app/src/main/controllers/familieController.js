import { queries } from './../models/index.js'
import log from 'electron-log';
import { Text } from '../utils/text.js';

class FamilieController {

    constructor() {
        this.queries = queries;
    }

    get() {
        try {
            const data = this.queries.findAll('families');
            return {
                success: true,
                data: data
            }
        } catch (error) {
            log.error('Error getting family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    getDefault() {
        try {
            // Requête SQL directe pour LEFT JOIN avec COUNT
            const data = this.queries.raw(`
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
            `)
            
            return {
                success: true,
                data: data
            }
        } catch (error) {
            log.error('Error getting default family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    getCustom() {
        try {

            const data = this.queries.raw(`
                SELECT 
                    f.id,
                    f.name,
                    f.date_creation,
                    f.defaults,
                    COUNT(m.id) as medicament_count
                FROM families f
                LEFT JOIN medicaments m ON f.id = m.family_id
                WHERE f.defaults = 0
                GROUP BY f.id, f.name, f.date_creation, f.defaults
                ORDER BY f.name ASC
            `)
            
            return {
                success: true,
                data: data
            }
        } catch (error) {
            log.error('Error getting custom family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    addCustom(data) {
        try {
            
            const verify = this.queries.findOne('families', { name: Text.capitalize(data.name) })
            if(verify) {
                log.warn('le nom de la famille existe déjà:', data.name);
                return { success: false, error: 'Le nom de la famille existe déjà' }
            } else {
                this.queries.insert('families', {
                    name: Text.capitalize(data.name),
                    defaults: 0
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

    updateCustom(data) {
        try {
            
            const verify = this.queries.findOne('families', { name: Text.capitalize(data.name) })
            if(verify && verify.id !== data.id) {
                log.warn('le nom de la famille existe déjà:', data.name);
                return { success: false, error: 'Le nom de la famille existe déjà' }
            } else {
                this.queries.update('families', 
                { name: Text.capitalize(data.name) }, 
                { id: data.id })
                
                return { success: true}
            }
        } catch (error) {
            log.error('Error updating family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    deleteCustom(data) {
        try {

            const is_null = this.queries.join(
                {
                    from: "families",
                    columns: "families.id as ids",
                    join: {
                        table: "medicaments",
                        on: "families.id = medicaments.family_id"
                    },
                    where : {
                        ids : data.id
                    }
                }
            )

            if(is_null == 0) {
                this.queries.delete('families', { id: data.id })
                return { success: true}
            } else {
                return { 
                    success: false,
                    error: "Cette famille contient de produit, elle ne peut pas etre supprimée"
                }
            }
        } catch (error) {
            log.error('Error deleting family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}

export const familleController = new FamilieController();