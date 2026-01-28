import db from "./index.js";

export default {
    create({ nom, etat, prix_total, benefice, quantite }) {
        const med = db.prepare(`
            SELECT * FROM medicament WHERE nom = ?
        `).get(nom)

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

            db.prepare(`
            UPDATE achat
            SET prix_total = prix_total + ?
            WHERE idachat = ?
            `).run( med.prix_vente , existing.idachat)
            
            db.prepare(`
            UPDATE achat
            SET benefice = benefice + ?
            WHERE idachat = ?
            `).run( (med.prix_vente - med.prix_achat ) , existing.idachat)
        } else {
            let panier = 0
            db.prepare(`
            INSERT INTO achat (nom, etat, prix_total, benefice, quantite, panier)
            VALUES (?, ?, ?, ?, ?, ?)
            `).run(nom, etat, prix_total, benefice , quantite ,panier)
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

    getLimit() {
        return db.prepare(`
            SELECT
            panier,
            MAX(datecreate) AS datecreate,
            SUM(quantite) AS totalArticles,
            SUM(prix_total) AS totalPrix,
            SUM(benefice) AS totalBenefice
            FROM achat
            WHERE etat = 'confirmer'
            AND DATE(datecreate) = DATE('now')
            GROUP BY panier
            ORDER BY MAX(datecreate) DESC
            LIMIT 5
        `).all()
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