const { runSelect, runDML, runInsert, runUpdate } = require("./util")


class TermDAO {
    constructor(db) {
        this.db = db
    }

    async init(reset) {
        if (reset) {
            await runDML(this.db, 'DROP TABLE IF EXISTS terms')
            await runDML(this.db, `DROP TABLE IF EXISTS group_detail`)
        }
        await runDML(this.db, `
            CREATE TABLE IF NOT EXISTS terms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                term TEXT NOT NULL,
                definition TEXT NOT NULL,
                "case" INTEGER DEFAULT 0,
                pos INTEGER,
                notes TEXT DEFAULT '',
                pps TEXT DEFAULT '["", "", "", "", "", ""]'
                );
        `)
        await runDML(this.db, `PRAGMA foreign_keys = on;`)
        
        await runDML(this.db, `
            CREATE TABLE IF NOT EXISTS group_detail (
                group_id INTEGER NOT NULL,
                term_id INTEGER NOT NULL,
                PRIMARY KEY (group_id, term_id)
                FOREIGN KEY (group_id) REFERENCES groups (id)
                FOREIGN KEY (term_id) REFERENCES terms (id)
            );
        `)
    }

    async op(name, args) {
        switch (name) {
            case 'list': return await this.listTerms(args[0], args[1], args[2])
            case 'add': return await this.addTerm(args[0])
            case 'update': return await this.updateTerm(args[0])
            case 'remove': return await this.removeTerm(args[0])
            default: throw Error(`Invalid operation: ${name}`)
        }
    }

    async listTerms(offset, limit, filter) {        
        const { termFilter, definitionFilter, group, pos } = filter
        
        const tf = termFilter ? `%${termFilter}%` : '%'
        const df = definitionFilter ? `%${definitionFilter}%` : '%'
        const pf = `(${pos.join()})`
        const g = group || -1

        try {
            const results = await runSelect(this.db, `
                select terms.id, term, definition, "case", pos, notes, pps, 
                    group_concat(group_id, ',') as groups
                from terms 
                left join group_detail on terms.id = group_detail.term_id 
                where term like ? and
                definition like ? and
                pos in ${pf}
                group by 1, 2, 3, 4, 5, 6, 7
                having (${g} = -1 or groups like '%${g}%') 
                order by term asc
                limit ${offset}, ${limit}
                
            `, [tf, df])
            
            return [true, results
                .map(t => ({...t, groups: t.groups ? t.groups.split(',').map(x => parseInt(x)) : []}))
                .map(t => ({...t, pps: JSON.parse(t.pps)}))
            ]
        } catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async addTerm(t) {
        
        const { term, definition, notes, pps, pos, groups } = t
        try {
            const id = await runInsert(this.db, `
                insert into terms (term, definition, "case", notes, pps, pos)
                values (?, ?, ?, ?, ?, ?)
            `, [term, definition, t["case"], notes, JSON.stringify(pps), pos])

            for (const g of groups) {
                await runInsert(this.db, `
                    insert into group_detail (term_id, group_id) values (?, ?)
                `, [id, g])
            }

            return [true, id]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async updateTerm(t) {
        const { id, term, definition, notes, pps, pos, groups } = t
        const result = await runUpdate(this.db, `
            update terms set 
                term = ?,
                definition = ?,
                "case" = ?,
                notes = ?,
                pps = ?,
                pos = ?
            where id = ? 
        `, [term, definition, t["case"], notes, JSON.stringify(pps), pos, id])
        await runUpdate(this.db, `delete from group_detail where term_id = ${id} and group_id not in (${groups.join(',')})`)
        for (const g of groups) {
            await runInsert(this.db, `
                insert or ignore into group_detail (term_id, group_id) values (?, ?) 
            `, [id, g])
        }
        return [true, result]
    }

    async removeTerm(id) {
        try {
            const first = await runUpdate(this.db, `delete from group_detail where term_id = ?`, [id])
            const second = await runUpdate(this.db, `delete from terms where id = ?`, [id])
            return [true, first, second]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

}

module.exports = TermDAO