const { runSelect, runDML, runInsert, runUpdate } = require("./util")

class GroupDAO {
    constructor(db) {
        this.db = db
    }

    async init(reset=false) {
        if (reset) {
            await runDML(this.db, 'drop table if exists groups')
        }
        await runDML(this.db, `
            create table if not exists groups (
                id integer primary key autoincrement,
                description text unique
            );
        `)
    }


    async op(name, args) {
        switch (name) {
            case 'list': return await this.listGroups()
            case 'add': return await this.addGroup(args[0])
            case 'update': return await this.updateGroup(args[0], args[1])
            case 'remove': return await this.removeGroup(args[0])
            default: throw Error(`Invalid operation: ${name}`)
        }
    }

    async listGroups() {
        try {
            const results = await runSelect(this.db, `select id, description from groups;`)
            return [true, results];
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async addGroup(description) {
        try {
            const id = await runInsert(this.db, `insert into groups (description) values (?)`, [description])
            return [true, id]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async updateGroup(id, description) {
        try {
            const result = await runUpdate(this.db, `update groups set description = ? where id = ?;`, [description, id])
            return [true, result]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async removeGroup(id) {
        try {
            const result = await runUpdate(this.db, `delete from groups where id = ?;`, [id])
            return [true, result]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }


}

module.exports = GroupDAO