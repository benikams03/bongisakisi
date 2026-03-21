import { ipcMain } from 'electron'
import { queries } from './models/index.js'

// Test de base
ipcMain.handle('test', () => 'BongisaKisi API fonctionne!')

// ---------- Fonction utilitaire pour vérifier la base de données ----------
const checkDatabase = () => {
    if (!queries) {
        throw new Error('Base de données non disponible - mode dégradé');
    }
    return true;
};

// ---------- Handlers pour les médicaments ----------
ipcMain.handle('getMedicaments', () => {
    try {
        checkDatabase();
        return queries.getMedicamentsWithStock();
    } catch (error) {
        console.error('Erreur getMedicaments:', error);
        return [];
    }
})

ipcMain.handle('searchMedicaments', (_, searchTerm) => {
    try {
        checkDatabase();
        return queries.searchMedicaments(searchTerm);
    } catch (error) {
        console.error('Erreur searchMedicaments:', error);
        return [];
    }
})

ipcMain.handle('addMedicament', (_, medicament) => {
    try {
        checkDatabase();
        return queries.insert('medicaments', medicament);
    } catch (error) {
        console.error('Erreur addMedicament:', error);
        throw error;
    }
})

ipcMain.handle('updateMedicament', (_, id, data) => {
    try {
        checkDatabase();
        return queries.update('medicaments', data, { id });
    } catch (error) {
        console.error('Erreur updateMedicament:', error);
        throw error;
    }
})

ipcMain.handle('deleteMedicament', (_, id) => {
    try {
        checkDatabase();
        return queries.delete('medicaments', { id });
    } catch (error) {
        console.error('Erreur deleteMedicament:', error);
        throw error;
    }
})

// ---------- Handlers pour les ventes ----------
ipcMain.handle('getVentes', (_, dateDebut, dateFin) => {
    try {
        checkDatabase();
        return queries.getVentesWithDetails(dateDebut, dateFin);
    } catch (error) {
        console.error('Erreur getVentes:', error);
        return [];
    }
})

ipcMain.handle('addVente', (_, vente) => {
    try {
        checkDatabase();
        // Ajouter la vente
        const result = queries.insert('ventes', vente);
        
        // Mettre à jour le stock
        queries.insert('stocks', {
            medicament_id: vente.medicament_id,
            quantite: vente.quantite,
            type_operation: 'vente',
            reference_id: result.lastInsertRowid,
            motif: 'Vente automatique'
        });
        
        return result;
    } catch (error) {
        console.error('Erreur addVente:', error);
        throw error;
    }
})

// ---------- Handlers pour les clients ----------
ipcMain.handle('getClients', () => {
    try {
        checkDatabase();
        return queries.findAll('clients');
    } catch (error) {
        console.error('Erreur getClients:', error);
        return [];
    }
})

ipcMain.handle('addClient', (_, client) => {
    try {
        checkDatabase();
        return queries.insert('clients', client);
    } catch (error) {
        console.error('Erreur addClient:', error);
        throw error;
    }
})

ipcMain.handle('updateClient', (_, id, data) => {
    try {
        checkDatabase();
        return queries.update('clients', data, { id });
    } catch (error) {
        console.error('Erreur updateClient:', error);
        throw error;
    }
})

// ---------- Handlers pour les statistiques ----------
ipcMain.handle('getStatistiques', () => {
    try {
        checkDatabase();
        return queries.getStatistiques();
    } catch (error) {
        console.error('Erreur getStatistiques:', error);
        return {
            totalMedicaments: 0,
            totalClients: 0,
            totalVentes: 0,
            chiffreAffaire: 0,
            ventesDuJour: 0,
            chiffreAffaireJour: 0,
            stocksCritiques: 0
        };
    }
})

// ---------- Handler pour les données utilisateur ----------
ipcMain.handle('getUserData', (_, id, name) => {
    return { name: name, id: id, role: 'admin' };
})