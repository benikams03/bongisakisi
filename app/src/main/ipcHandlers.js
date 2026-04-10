import { ipcMain } from 'electron'
import { settingsController } from './controllers/settingsController.js'
import { familleController } from './controllers/familieController.js'
import { produitController } from './controllers/produitController.js'
import { fournisseurController } from './controllers/fournisseurController.js'
import { acquisitionController } from './controllers/acquisitionController.js'
import { orderController } from './controllers/orderController.js'
import { rapportController } from './controllers/rapportController.js'

// Test de base
ipcMain.handle('test', () => 'BongisaKisi API fonctionne!')

ipcMain.handle('getSettings', () => settingsController.get())
ipcMain.handle('setSettings', (_, settings) => settingsController.set(settings))

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
