import { ipcMain } from 'electron'
import { settingsController } from './controllers/settingsController.js'
import { familleController } from './controllers/familieController.js'
import { produitController } from './controllers/produitController.js'

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