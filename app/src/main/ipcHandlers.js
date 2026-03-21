import { ipcMain } from 'electron'
import { SettingsController } from './controllers/settingsController.js'
// import { queries } from './models/index.js'

const settingsController = new SettingsController()

// Test de base
ipcMain.handle('test', () => 'BongisaKisi API fonctionne!')

// Settings handlers
ipcMain.handle('getSettings', () => settingsController.get())
ipcMain.handle('setSettings', (_, settings) => settingsController.set(settings))

// ipcMain.handle('getClients', () => {
//     try {
//         checkDatabase();
//         return queries.findAll('clients');
//     } catch (error) {
//         console.error('Erreur getClients:', error);
//         return [];
//     }
// })
