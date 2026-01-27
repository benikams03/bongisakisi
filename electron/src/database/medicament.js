import db from "./index.js";

export default {
    create({ nom, categorieid, date_expiration, prix_achat, prix_vente, quantite, statut }) {
        return db.prepare(`
        INSERT INTO medicament (nom, categorieid, date_expiration, prix_achat, prix_vente, quantite, statut)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(nom, categorieid, date_expiration, prix_achat, prix_vente, quantite, statut);
    },

    get() {
        return db.prepare(`
        SELECT m.*, c.nom AS categorie_nom
        FROM medicament m
        LEFT JOIN categorie c ON m.categorieid = c.idcategorie
        ORDER BY m.idmed DESC
        `).all();
    },

    getById(idmed) {
        return db.prepare(`
        SELECT m.*, c.nom AS categorie_nom
        FROM medicament m
        LEFT JOIN categorie c ON m.categorieid = c.idcategorie
        WHERE m.idmed = ?
        `).get(idmed);
    },

    update(idmed, { nom, categorieid, date_expiration, prix_achat, prix_vente, quantite, statut }) {
        return db.prepare(`
        UPDATE medicament
        SET nom = ?, categorieid = ?, date_expiration = ?, prix_achat = ?, prix_vente = ?, quantite = ?, statut = ?
        WHERE idmed = ?
        `).run(nom, categorieid, date_expiration, prix_achat, prix_vente, quantite, statut, idmed);
    },

    delete(idmed) {
        return db.prepare('DELETE FROM medicament WHERE idmed = ?').run(idmed);
    }
};
