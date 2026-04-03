import { queries } from './../models/index.js'
import log from 'electron-log';
import { Text } from '../utils/text.js';


class FournisseurController {

    constructor() {
        this.queries = queries;
    }
    
    get() {
        try {
            const fournisseurs = this.queries.findAll('fournisseurs');
            
            const result = fournisseurs.map(fournisseur => {
                const acquisitions = this.queries.find('acquisition', { 
                    id_fournisseur: fournisseur.id,
                    status: 'waiting'
                });
                
                return {
                    id: fournisseur.id,
                    name: fournisseur.name,
                    data: acquisitions
                };
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            log.error('Error getting fournisseurs:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    add(data) {
        try {
            const fournisseur = this.queries.insert('fournisseurs', {
                name: Text.capitalize(data.name)
            });
            return {
                success: true,
                data: fournisseur
            };
        } catch (error) {
            log.error('Error adding fournisseur:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    update(data) {
        try {
            const fournisseur = this.queries.update('fournisseurs', 
                { name: Text.capitalize(data.name) }, 
                { id: data.id });
            return { success: true };
        } catch (error) {
            log.error('Error updating fournisseur:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    delete(id) {
        try {
            this.queries.delete('fournisseurs', { id });
            return { success: true };
        } catch (error) {
            log.error('Error deleting fournisseur:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
}

export const fournisseurController = new FournisseurController();
