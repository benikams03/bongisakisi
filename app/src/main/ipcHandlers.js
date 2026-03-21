import { ipcMain } from 'electron'
import { SettingsController } from './controllers/settingsController.js'
import { FamilieController } from './controllers/familieController.js'

const settingsController = new SettingsController()
const familleController = new FamilieController()

// Test de base
ipcMain.handle('test', () => 'BongisaKisi API fonctionne!')

ipcMain.handle('getSettings', () => settingsController.get())
ipcMain.handle('setSettings', (_, settings) => settingsController.set(settings))

ipcMain.handle('getDefaultFamille', () => familleController.getDefault())
