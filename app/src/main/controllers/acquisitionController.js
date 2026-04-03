import { queries } from '../models/index.js';
import log from 'electron-log';
import { Text } from '../utils/text.js';

class AcquisitionController {
    
    constructor() {
        this.queries = queries;
    }

    add(data) {
        try {
            
            const verify_medoc = this.queries.findOne('medicaments', { name: Text.capitalize(data.name_medoc) });
            if(verify_medoc) {
                log.warn('le nom du médicament existe déjà:', data.name_medoc);
                return { 
                    success: false, 
                    error: 'Le nom du médicament existe déjà' 
                }
            }

            this.queries.insert('acquisition', {
                id_fournisseur: data.id_fournisseur,
                id_family: data.id_family,
                name_medoc: Text.capitalize(data.name_medoc),
                status: 'waiting',
            });
            return { success: true };
        } catch (error) {
            log.error(Text.ERROR_ADD_ACQUISITION, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validate (id) {
        try {
            this.queries.update('acquisition', { status: 'validated' }, { id });
            return { success: true };
        } catch (error) {
            log.error(Text.ERROR_UPDATE_ACQUISITION, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    delete(id) {
        try {
            this.queries.delete('acquisition', { id });
            return { success: true };
        } catch (error) {
            log.error(Text.ERROR_DELETE_ACQUISITION, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export const acquisitionController = new AcquisitionController();
