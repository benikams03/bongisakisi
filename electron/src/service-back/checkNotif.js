import db from "../database/index.js"

export function checkExpirationNotifications() {
    const meds = db.prepare(`
        SELECT idmed, date_expiration
        FROM medicament
        WHERE date_expiration IS NOT NULL
        AND DATE(date_expiration) <= DATE('now', '+30 day')
    `).all()

    const checkNotif = db.prepare(`
        SELECT 1 FROM notification
        WHERE idMedoc = ?
        AND type = 'expiration'
        AND read = 0
    `)

    const insertNotif = db.prepare(`
        INSERT INTO notification (idMedoc, type, read)
        VALUES (?, 'expiration', 0)
    `)

    const insert = db.transaction(() => {
        for (const med of meds) {
            const exists = checkNotif.get(med.idmed)
            if (!exists) {
                insertNotif.run(med.idmed)
            }
        }
    })

    insert()
}
