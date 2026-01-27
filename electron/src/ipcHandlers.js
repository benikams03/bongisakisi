import { ipcMain } from 'electron'
import categorie from './database/categorie.js'
import medicaments from './database/medicament.js'
import notificationDB from './database/notification.js'
import achatDB from './database/achat.js'
import db from './database/index.js'


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

// ------------------------------------------------------------------------------------------------

ipcMain.handle('medicaments:totals', () => {
    const row = db.prepare(`
        SELECT 
        SUM(prix_achat * quantite) AS total_achat,
        SUM(prix_vente * quantite) AS total_vente
        FROM medicament
    `).get()

    return {
        totalAchat: row.total_achat || 0,
        totalVente: row.total_vente || 0
    }
})

ipcMain.handle('panier:totals', () => {
    const row = db.prepare(`
        SELECT 
        SUM(prix_total * quantite) AS prix_total,
        SUM(benefice * quantite) AS benefice
        FROM achat
        WHERE etat = 'attente'
    `).get()

    return {
        total: row.prix_total || 0,
        totalbenef: row.benefice || 0
    }
})

ipcMain.handle('panier:add', (_, name, id) => {
    const med = db.prepare(`
        SELECT quantite FROM medicament WHERE nom = ?
    `).get(name)

    if (!med || med.quantite <= 0) {
        return { success: false }
    }

    db.prepare(`
        UPDATE medicament
        SET quantite = quantite - 1
        WHERE nom = ?
    `).run(name)

    db.prepare(`
        UPDATE achat
        SET quantite = quantite + 1
        WHERE idachat = ?
    `).run(id)

    return { success: true }
})

ipcMain.handle('panier:remove', (_, name, id) => {
    const achat = db.prepare(`
        SELECT quantite FROM achat WHERE idachat = ?
    `).get(id)

    if (!achat || achat.quantite <= 1) {
        return { success: false }
    }

    db.prepare(`
        UPDATE medicament
        SET quantite = quantite + 1
        WHERE nom = ?
    `).run(name)

    db.prepare(`
        UPDATE achat
        SET quantite = quantite - 1
        WHERE idachat = ?
    `).run(id)

    return { success: true }
})

ipcMain.handle('achat:confirm-all', () => {
    const result = db.prepare(`
        UPDATE achat
        SET etat = 'confirmer'
        WHERE etat = 'attente'
    `).run()

    return {
        success: true,
        updated: result.changes
    }
})

ipcMain.handle('achat:stats-day', () => {
    const row = db.prepare(`
        SELECT
        COUNT(*) AS totalAchats,
        SUM(prix_total) AS totalPrix,
        SUM(benefice) AS totalBenefice
        FROM achat
        WHERE DATE(datecreate) = DATE('now')
        AND etat = 'confirmer'
    `).get()

    return {
        totalAchats: row.totalAchats || 0,
        totalPrix: row.totalPrix || 0,
        totalBenefice: row.totalBenefice || 0
    }
})

