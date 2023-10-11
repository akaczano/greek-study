const { runDML } = require('./util')

const loadGroups = async (db) => {
    const group1 = `INSERT INTO groups (id, description) values (1, 'Group 1');`
    const group2 = `INSERT INTO groups (id, description) values (2, 'Group 2');`
    const group3 = `INSERT INTO groups (description) values ('Group 3');`
    await runDML(db, group1)
    await runDML(db, group2)
    await runDML(db, group3)
}





module.exports = { loadGroups }

