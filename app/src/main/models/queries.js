export class Queries {
    constructor(db) {
        this.db = db;
    }

    // ---------- CRUD ----------
    insert(table, data) {
        const keys = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(k => `@${k}`).join(", ");
        const stmt = this.db.prepare(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`);
        return stmt.run(data);
    }

    findAll(table, columns = "*") {
        return this.db.prepare(`SELECT ${columns} FROM ${table}`).all();
    }

    find(table, conditions = {}, columns = "*") {
        const where = Object.keys(conditions)
            .map(k => `${k}=@${k}`)
            .join(" AND ");
        if (!where) return this.findAll(table, columns);
        return this.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${where}`).all(conditions);
    }

    findOne(table, conditions = {}, columns = "*") {
        const where = Object.keys(conditions)
            .map(k => `${k}=@${k}`)
            .join(" AND ");
        if (!where) return null;
        return this.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${where}`).get(conditions);
    }

    update(table, data, conditions) {
        const set = Object.keys(data).map(k => `${k}=@${k}`).join(", ");
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        return this.db.prepare(`UPDATE ${table} SET ${set} WHERE ${where}`).run({ ...data, ...conditions });
    }

    delete(table, conditions) {
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        return this.db.prepare(`DELETE FROM ${table} WHERE ${where}`).run(conditions);
    }

    // ---------- Jointures ----------
    join(options) {
        const { columns = "*", from, join, where } = options;
        let sql = `SELECT ${columns} FROM ${from} JOIN ${join.table} ON ${join.on}`;
        if (where && Object.keys(where).length) {
            const whereClause = Object.keys(where).map(k => `${k}=@${k}`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
            return this.db.prepare(sql).all(where);
        }
        return this.db.prepare(sql).all();
    }

    // ---------- Compter les enregistrements ----------
    count(table, conditions = {}) {
        if (Object.keys(conditions).length === 0) {
            return this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
        }
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        return this.db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE ${where}`).get(conditions).count;
    }

    // ---------- Requête brute ----------
    raw(sql, params = {}) {
        return this.db.prepare(sql).all(params);
    }
}
