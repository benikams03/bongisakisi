import { queries } from './../models/index.js'
import Log from 'electron-log';
import { Text } from '../utils/text.js';

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
            Log.error('Error getting default family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    getCustom() {
        try {

            const sql = `
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
            `;
            
            const data = this.queries.db.prepare(sql).all();
            
            return {
                success: true,
                data: data
            }
        } catch (error) {
            Log.error('Error getting custom family:', error);
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
                return { success: false, error: 'Le nom de la famille existe déjà' }
            } else {
                this.queries.insert('families', {
                    name: Text.capitalize(data.name),
                    defaults: 0
                })
                return { success: true}
            }
        } catch (error) {
            Log.error('Error adding family:', error);
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
                return { success: false, error: 'Le nom de la famille existe déjà' }
            } else {
                this.queries.update('families', 
                {
                    name: Text.capitalize(data.name)
                }, { id: data.id })
                
                return { success: true}
            }
        } catch (error) {
            Log.error('Error updating family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

    deleteCustom(data) {
        try {
            this.queries.delete('families', { id: data.id })
            return { success: true}
        } catch (error) {
            Log.error('Error deleting family:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }

}