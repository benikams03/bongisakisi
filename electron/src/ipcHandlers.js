import { ipcMain } from 'electron'
import categorie from './database/categorie.js'
import medicaments from './database/medicament.js'
import notificationDB from './database/notification.js'
import achatDB from './database/achat.js'


// categorie 
ipcMain.handle('categorie:create', (_, name) => categorie.create(name))
ipcMain.handle('categorie:getAll', () => categorie.get())
ipcMain.handle('categorie:getById', (_,id) => categorie.getById(id))
ipcMain.handle('categorie:update', (_,id, name) => categorie.update(id, name))
ipcMain.handle('categorie:delete', (_,id) => categorie.delete(id))

// medicaments
ipcMain.handle('medicament:create', (_, medicament) => medicaments.create(medicament))
ipcMain.handle('medicament:getAll', () => medicaments.get())
ipcMain.handle('medicament:getById', (_, idmed) => medicaments.getById(idmed))
ipcMain.handle('medicament:update', (_, idmed, medicament) => medicaments.update(idmed, medicament))
ipcMain.handle('medicament:delete', (_, idmed) => medicaments.delete(idmed))

// notifications
ipcMain.handle('notification:create', (_, notification) => notificationDB.create(notification))
ipcMain.handle('notification:getAll', () => notificationDB.get())
ipcMain.handle('notification:getById', (_, idnotif) => notificationDB.getById(idnotif))
ipcMain.handle('notification:update', (_, idnotif, notification) => notificationDB.update(idnotif, notification))
ipcMain.handle('notification:delete', (_, idnotif) => notificationDB.delete(idnotif))

// achat
ipcMain.handle('achat:create', (_, achat) => achatDB.create(achat))
ipcMain.handle('achat:getAll', () => achatDB.get())
ipcMain.handle('achat:get', (_, idachat) => achatDB.getById(idachat))
ipcMain.handle('achat:update', (_, idachat, achat) => achatDB.update(idachat, achat))
ipcMain.handle('achat:delete', (_, idachat) => achatDB.delete(idachat))