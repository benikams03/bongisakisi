import { ipcMain } from 'electron'
import Log from 'electron-log';
import { settingsController } from './controllers/settingsController.js'
import { familleController } from './controllers/familieController.js'
import { produitController } from './controllers/produitController.js'
import { fournisseurController } from './controllers/fournisseurController.js'
import { acquisitionController } from './controllers/acquisitionController.js'
import { orderController } from './controllers/orderController.js'
import { rapportController } from './controllers/rapportController.js'
import { activateKeyController } from './controllers/activateKey.js';
import updater from "electron-updater";
const { autoUpdater } = updater;
import { dialog } from 'electron';
import Store from 'electron-store';

const store = new Store();

// Variable pour stocker la fenêtre principale
let mainWindow = null;

// Fonction pour définir la fenêtre principale
export const setMainWindow = (window) => {
    mainWindow = window;
};

// Test de base
ipcMain.handle('test', () => 'BongisaKisi API fonctionne!')

ipcMain.handle('getSettings', () => settingsController.get())
ipcMain.handle('setSettings', (_, settings) => settingsController.set(settings))
ipcMain.handle('updateSettings', (_, settings) => settingsController.update(settings))

ipcMain.handle('getFamilles', () => familleController.get())
ipcMain.handle('getDefaultFamille', () => familleController.getDefault())
ipcMain.handle('getCustomFamilles', () => familleController.getCustom())
ipcMain.handle('addCustomFamille', (_, data) => familleController.addCustom(data))
ipcMain.handle('updateCustomFamille', (_, data) => familleController.updateCustom(data))
ipcMain.handle('deleteCustomFamille', (_, data) => familleController.deleteCustom(data))

ipcMain.handle('getProduits', () => produitController.get())
ipcMain.handle('addProduit', (_, data) => produitController.add(data))
ipcMain.handle('updateProduit', (_, data, id) => produitController.update(data, id))
ipcMain.handle('deleteProduit', (_, id) => produitController.delete(id))
ipcMain.handle('addStock', (_, data) => produitController.addStock(data))
ipcMain.handle('updateExpiry', (_, data) => produitController.updateExpiry(data))

ipcMain.handle('getFournisseurs', () => fournisseurController.get())
ipcMain.handle('addFournisseur', (_, data) => fournisseurController.add(data))
ipcMain.handle('updateFournisseur', (_, data) => fournisseurController.update(data))
ipcMain.handle('deleteFournisseur', (_, id) => fournisseurController.delete(id))

ipcMain.handle('addAcquisition', (_, data) => acquisitionController.add(data))
ipcMain.handle('validateAcquisition', (_, id) => acquisitionController.validate(id))
ipcMain.handle('deleteAcquisition', (_, id) => acquisitionController.delete(id))
ipcMain.handle('getAcquisitionCount', () => acquisitionController.getCount())

ipcMain.handle('getPanier', () => orderController.getPanier())
ipcMain.handle('addPanier', (_, data) => orderController.addPanier(data))
ipcMain.handle('removePanier', (_, data) => orderController.removePanier(data))
ipcMain.handle('removePanierDirect', (_, data) => orderController.removePanierDirect(data))
ipcMain.handle('confirmPanier', () => orderController.confirmPanier())  
ipcMain.handle('getPanierToday', () => orderController.getPanierToday())
ipcMain.handle('annulerCommande', (_, id) => orderController.annulerCommande(id))

ipcMain.handle('getStatCaissier', () => rapportController.getStatCaissier())
ipcMain.handle('getStatDashbord', (_, choix) => rapportController.getStatDashbord(choix) )
ipcMain.handle('getLowStockItems', () => rapportController.getLowStockItems())
ipcMain.handle('getExpiredItems', () => rapportController.getExpiredItems())
ipcMain.handle('getStatAdmin', (_, choix) => rapportController.getStatAdmin(choix))

ipcMain.handle('getActivate', () => activateKeyController.get())
ipcMain.handle('createActive', (_, data) => activateKeyController.set(data))
ipcMain.handle('updateActive', (_, data) => activateKeyController.update(data))
ipcMain.handle('getOsInfo', () => activateKeyController.getOsInfo())


ipcMain.handle("check-update", async () => {
    const result = await autoUpdater.checkForUpdates()
    Log.info('Update check result:', result)
    return {
        ...result?.updateInfo,
        isUpdateAvailable: result?.updateInfo && result?.updateInfo.version ? true : false
    }
})

ipcMain.handle("start-update", async () => {
    try {
        // Vérifier d'abord si une mise à jour est disponible
        const checkResult = await autoUpdater.checkForUpdates()
        if (!checkResult || !checkResult.updateInfo || !checkResult.updateInfo.version) {
        return { success: false, error: "Aucune mise à jour disponible" }
        }
        
        // Démarrer le téléchargement
        await autoUpdater.downloadUpdate()
        return { success: true }
    } catch (error) {
        Log.error('Error starting download:', error)
        return { success: false, error: error.message }
    }
})

// progression
autoUpdater.on("download-progress", (progress) => {
    if (mainWindow) {
        mainWindow.webContents.send("update-progress", {
        percent: progress.percent,
        speed: progress.bytesPerSecond
        })
    }
})

autoUpdater.on("update-downloaded", () => {
    if (mainWindow) {
        mainWindow.webContents.send("update-downloaded")
    }
})

ipcMain.handle("install-update", () => {
    autoUpdater.quitAndInstall()
})

// Handler pour ouvrir le dialogue de sélection de dossier
ipcMain.handle('open-folder-dialog', async () => {
    try {
        if (!mainWindow) {
            throw new Error('Fenêtre principale non trouvée')
        }

        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            title: 'Sélectionner un dossier pour les exports PDF',
            buttonLabel: 'Sélectionner ce dossier'
        })

        return result
    } catch (error) {
        Log.error('Erreur lors de l\'ouverture du dialogue de dossier:', error)
        throw error
    }
})

// Handlers pour les paramètres d'exportation PDF
ipcMain.handle('get-pdf-export-settings', () => {
    try {
        const settings = store.get('pdfExportSettings', {
            pdfExportPath: 'C:\\Users\\benik\\Documents\\01_PROJETS\\PERSO\\05_BongisaKisi\\bongisakisi\\app',
            pdfAutoOpen: true,
            pdfIncludeCharts: true,
            pdfIncludeDetails: true,
            pdfFormat: 'A4',
            pdfOrientation: 'portrait'
        });
        return settings;
    } catch (error) {
        Log.error('Erreur lors de la récupération des paramètres PDF:', error);
        throw error;
    }
});

ipcMain.handle('save-pdf-export-settings', (_, settings) => {
    try {
        store.set('pdfExportSettings', settings);
        Log.info('Paramètres d\'exportation PDF sauvegardés:', settings);
        return { success: true };
    } catch (error) {
        Log.error('Erreur lors de la sauvegarde des paramètres PDF:', error);
        throw error;
    }
});