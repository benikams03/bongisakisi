import db from "./index.js";

export default {
    create({ titre, details }) {
        return db.prepare(`
        INSERT INTO notification (titre, details) VALUES (?, ?)
        `).run(titre, details);
    },

    get() {
        return db.prepare('SELECT * FROM notification ORDER BY datecreate DESC').all();
    },

    getById(idnotif) {
        return db.prepare('SELECT * FROM notification WHERE idnotif = ?').get(idnotif);
    },

    update(idnotif, { titre, details }) {
        return db.prepare(`
        UPDATE notification
        SET titre = ?, details = ?
        WHERE idnotif = ?
        `).run(titre, details, idnotif);
    },

    delete(idnotif) {
        return db.prepare('DELETE FROM notification WHERE idnotif = ?').run(idnotif);
    }
};