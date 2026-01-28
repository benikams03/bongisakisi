import db from "./index.js";

export default {
    create({ idMedoc, type }) {
        const existing = db.prepare(`
            SELECT idnotif
            FROM notification
            WHERE idMedoc = ?
            AND type = ?
            AND read = 0
        `).get(idMedoc, type)

        if (existing) {
            return { created: false, reason: 'already_exists' }
        }

        db.prepare(`
            INSERT INTO notification (idMedoc, type, read)
            VALUES (?, ?, 0)
        `).run(idMedoc, type)

        return { created: true }
    },

    get() {
        return db.prepare(`
        SELECT *
        FROM notification
        LEFT JOIN medicament ON notification.idMedoc = medicament.idmed
        WHERE read = 0
        ORDER BY notification.idnotif DESC
        `).all();
    },

    getById(idnotif) {
        return db.prepare('SELECT * FROM notification WHERE idnotif = ?').get(idnotif);
    },

    update(idnotif, read) {
        return db.prepare(`
        UPDATE notification
        SET read = ?
        WHERE idMedoc = ?
        AND read = 0
        `).run(read, idnotif);
    },

    delete(idnotif) {
        return db.prepare('DELETE FROM notification WHERE idnotif = ?').run(idnotif);
    }
};