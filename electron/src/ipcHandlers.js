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
ipcMain.handle('achat:get', () => achatDB.get())
ipcMain.handle('achat:getLimit', () => achatDB.getLimit())
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
        SUM(prix_total) AS prix_total,
        SUM(benefice) AS benefice
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
        SELECT * FROM medicament WHERE nom = ?
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
    
    db.prepare(`
        UPDATE achat
        SET prix_total = prix_total + ?
        WHERE idachat = ?
    `).run( med.prix_vente ,id)
    
    db.prepare(`
        UPDATE achat
        SET benefice = benefice + ?
        WHERE idachat = ?
    `).run( (med.prix_vente - med.prix_achat ) ,id)

    return { success: true }
})

ipcMain.handle('panier:remove', (_, name, id) => {
    const med = db.prepare(`
        SELECT * FROM medicament WHERE nom = ?
    `).get(name)

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

    db.prepare(`
        UPDATE achat
        SET prix_total = prix_total - ?
        WHERE idachat = ?
    `).run( med.prix_vente ,id)

    db.prepare(`
        UPDATE achat
        SET benefice = benefice - ?
        WHERE idachat = ?
    `).run( (med.prix_vente - med.prix_achat ) ,id)

    return { success: true }
})

ipcMain.handle('achat:confirm-all', () => {
    const row = db.prepare(`
        SELECT MAX(panier) AS lastPanier
        FROM achat
        WHERE etat = 'confirmer'
        AND DATE(datecreate) = DATE('now')
    `).get()

    const newPanier = row?.lastPanier ? row.lastPanier + 1 : 1

    const result = db.prepare(`
        UPDATE achat
        SET etat = 'confirmer',
            panier = ?
        WHERE etat = 'attente'
    `).run(newPanier)

    return {
        success: true,
        panier: newPanier,
        updated: result.changes
    }
})


ipcMain.handle('achat:stats-day', () => {
    const row = db.prepare(`
        SELECT
        SUM(quantite) AS totalunite,
        MAX(panier) AS totalAchats,
        SUM(prix_total) AS totalPrix,
        SUM(benefice) AS totalBenefice
        FROM achat
        WHERE DATE(datecreate) = DATE('now')
        AND etat = 'confirmer'
    `).get()

    return {
        totalunite: row.totalunite || 0,
        totalAchats: row.totalAchats || 0,
        totalPrix: row.totalPrix || 0,
        totalBenefice: row.totalBenefice || 0
    }
})

ipcMain.handle('achat:stats-month', () => {
    const row = db.prepare(`
        SELECT
        SUM(quantite) AS totalunite,
        MAX(panier) AS totalAchats,
        SUM(prix_total) AS totalPrix,
        SUM(benefice) AS totalBenefice
        FROM achat
        WHERE strftime('%Y-%m', datecreate) = strftime('%Y-%m', 'now')
        AND etat = 'confirmer'
    `).get()

    return {
        totalunite: row.totalunite || 0,
        totalAchats: row.totalAchats || 0,
        totalPrix: row.totalPrix || 0,
        totalBenefice: row.totalBenefice || 0
    }
})


ipcMain.handle('rapport:bestvente', () => {
    return db.prepare(`
        SELECT 
        nom,
        SUM(quantite) AS quantite,
        SUM(benefice) AS benefice
        FROM achat
        WHERE etat = 'confirmer'
        AND DATE(datecreate) = DATE('now')
        GROUP BY nom
        ORDER BY quantite DESC
    `).all()
})

ipcMain.handle('rapport:bestventeMonth', () => {
    return db.prepare(`
        SELECT 
        nom,
        SUM(quantite) AS quantite,
        SUM(benefice) AS benefice
        FROM achat
        WHERE etat = 'confirmer'
        AND strftime('%Y-%m', datecreate) = strftime('%Y-%m', 'now')
        GROUP BY nom
        ORDER BY quantite DESC
    `).all()
})

ipcMain.handle('achats:getAllChart', () => {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i)) // 7 derniers jours

        const dateStr = date.toISOString().split('T')[0]

        const row = db.prepare(`
            SELECT 
            SUM(prix_total) AS totalPrix,
            SUM(benefice) AS totalBenefice
            FROM achat
            WHERE DATE(datecreate) = ?
            AND etat = 'confirmer'
        `).get(dateStr)

        return {
            date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
            revenue: row.totalPrix || 0,
            profit: row.totalBenefice || 0
        }
    })
})

ipcMain.handle('achats:getAllChartMonth', () => {
    return Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (11 - i)) // 12 derniers mois

        const dateStr = date.toISOString().slice(0, 7)

        const row = db.prepare(`
            SELECT
            SUM(prix_total) AS totalPrix,
            SUM(benefice) AS totalBenefice
            FROM achat
            WHERE strftime('%Y-%m', datecreate) = ?
            AND etat = 'confirmer'
        `).get(dateStr)

        return {
            date: date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
            revenue: row.totalPrix || 0,
            profit: row.totalBenefice || 0
        }
    })

})

