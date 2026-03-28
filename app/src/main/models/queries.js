export class Queries {
    constructor(db) {
        this.db = db;
    }

    // ---------- CRUD ----------
    // inser('name', { name: 'John' })
    insert(table, data) {
        const keys = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(k => `@${k}`).join(", ");
        const stmt = this.db.prepare(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`);
        return stmt.run(data);
    }

    // findAll('name')
    findAll(table, columns = "*", options = {}) {
        const { orderBy = null, order = 'ASC' } = options;
        let sql = `SELECT ${columns} FROM ${table}`;
        
        if (orderBy) {
            sql += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;
        }
        
        return this.db.prepare(sql).all();
    }

    // find('name', { name: 'John' })
    find(table, conditions = {}, columns = "*", options = {}) {
        const { orderBy = null, order = 'ASC' } = options;
        const where = Object.keys(conditions)
            .map(k => `${k}=@${k}`)
            .join(" AND ");
        
        let sql = `SELECT ${columns} FROM ${table}`;
        
        if (where) {
            sql += ` WHERE ${where}`;
        }
        
        if (orderBy) {
            sql += ` ORDER BY ${orderBy} ${order}`;
        }
        
        if (!where && !orderBy) return this.findAll(table, columns, options);
        return this.db.prepare(sql).all(conditions);
    }

    // findOne('name', { name: 'John' })
    findOne(table, conditions = {}, columns = "*", options = {}) {
        const { orderBy = null, order = 'ASC' } = options;
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        
        let sql = `SELECT ${columns} FROM ${table}`;
        
        if (where) {
            sql += ` WHERE ${where}`;
        }
        
        if (orderBy) {
            sql += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;
        }
        
        sql += ` LIMIT 1`;
        
        if (!where && !orderBy) return null;
        return this.db.prepare(sql).get(conditions);
    }

    // update('name', { name: 'John' }, { id: 1 })
    update(table, data, conditions) {
        const set = Object.keys(data).map(k => `${k}=@${k}`).join(", ");
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        return this.db.prepare(`UPDATE ${table} SET ${set} WHERE ${where}`).run({ ...data, ...conditions });
    }

    // delete('name', { id: 1 })
    delete(table, conditions) {
        const where = Object.keys(conditions).map(k => `${k}=@${k}`).join(" AND ");
        return this.db.prepare(`DELETE FROM ${table} WHERE ${where}`).run(conditions);
    }

    // ---------- Jointures ----------
    // join({ columns: "*", from: "table1", join: { table: "table2", on: "table1.id = table2.id" }, where: { id: 1 }, orderBy: "id", order: "ASC" })
    join(options) {
        const { columns = "*", from, join, where, orderBy = null, order = 'ASC' } = options;
        let sql = `SELECT ${columns} FROM ${from} JOIN ${join.table} ON ${join.on}`;
        
        if (where && Object.keys(where).length) {
            const whereClause = Object.keys(where).map(k => `${k}=@${k}`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }
        
        if (orderBy) {
            sql += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;
        }
        
        if (where && Object.keys(where).length) {
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
