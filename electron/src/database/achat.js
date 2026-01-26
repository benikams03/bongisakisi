import db from "./index.js";

export default {
    create({ details, prix_total, benefice }) {
        return db.prepare(`
        INSERT INTO achat (details, prix_total, benefice, quantite)
        VALUES (?, ?, ?)
        `).run(details, prix_total, benefice);
    },

    get() {
        return db.prepare('SELECT * FROM achat ORDER BY datecreate DESC').all();
    },

    getById(idachat) {
        return db.prepare('SELECT * FROM achat WHERE idachat = ?').get(idachat);
    },

    update(idachat, { details, prix_total, benefice, quantite }) {
        return db.prepare(`
        UPDATE achat
        SET details = ?, prix_total = ?, benefice = ?, quantite = ?
        WHERE idachat = ?
        `).run(details, prix_total, benefice, quantite ,idachat);
    },

    delete(idachat) {
        return db.prepare('DELETE FROM achat WHERE idachat = ?').run(idachat);
    }
};