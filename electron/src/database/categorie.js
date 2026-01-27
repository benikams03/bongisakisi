import db from "./index.js";

export default {
    create(nom) {
        return db.prepare('INSERT INTO categorie (nom) VALUES (?)').run(nom);
    },

    get() {
        return db.prepare('SELECT * FROM categorie ORDER BY idcategorie DESC').all();
    },

    getById(idcategorie) {
        return db.prepare('SELECT * FROM categorie WHERE idcategorie = ?').get(idcategorie);
    },

    update(idcategorie, nom) {
        return db.prepare('UPDATE categorie SET nom = ? WHERE idcategorie = ?').run(nom, idcategorie);
    },

    delete(idcategorie) {
        return db.prepare('DELETE FROM categorie WHERE idcategorie = ?').run(idcategorie);
    }
};