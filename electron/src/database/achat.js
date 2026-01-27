import db from "./index.js";

export default {
    create({ nom, etat, prix_total, benefice, quantite }) {
        const existing = db.prepare(`
            SELECT * FROM achat
            WHERE nom = ? AND etat = 'attente'
        `).get(nom)

        if (existing) {
            db.prepare(`
            UPDATE achat
            SET quantite = quantite + ?
            WHERE idachat = ?
            `).run(quantite, existing.idachat)
        } else {
            db.prepare(`
            INSERT INTO achat (nom, etat, prix_total, benefice, quantite)
            VALUES (?, ?, ?, ?, ?)
            `).run(nom, etat, prix_total, benefice, quantite)
        }

        db.prepare(`
            UPDATE medicament
            SET quantite = quantite - ?
            WHERE nom = ?
        `).run(quantite, nom)

        return { success: true }
    },

    get() {
        return db.prepare("SELECT * FROM achat WHERE etat = 'attente' ORDER BY datecreate DESC").all();
    },

    getById(idachat) {
        return db.prepare('SELECT * FROM achat WHERE idachat = ?').get(idachat);
    },

    update(idachat, { nom, etat, prix_total, benefice, quantite }) {
        return db.prepare(`
        UPDATE achat
        SET nom = ?, etat = ?, prix_total = ?, benefice = ?, quantite = ?
        WHERE idachat = ?
        `).run(nom, etat, prix_total, benefice, quantite ,idachat);
    },

    delete(idachat) {
        const achat = db.prepare(`
            SELECT nom, quantite
            FROM achat
            WHERE idachat = ?
        `).get(idachat)

        if (!achat) return { success: false }

        db.prepare(`
            UPDATE medicament
            SET quantite = quantite + ?
            WHERE nom = ?
        `).run(achat.quantite, achat.nom)

        db.prepare(`
            DELETE FROM achat
            WHERE idachat = ?
        `).run(idachat)

        return { success: true }
    }

};