const { runDML } = require('./util')

const loadGroups = async (db) => {
    const group1 = `INSERT INTO groups (id, description) values (1, 'Group 1');`
    const group2 = `INSERT INTO groups (id, description) values (2, 'Group 2');`
    const group3 = `INSERT INTO groups (description) values ('Group 3');`
    await runDML(db, group1)
    await runDML(db, group2)
    await runDML(db, group3)
}

const loadTerms = async (db) => { 
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (1, 'logos', 'word', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (2, 'fusis', 'nature', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (3, 'thaumazo', 'admire, wonder at', 0, 1);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos, pps) values (4, 'luo', 'loosen', 0, 1, '["luo", "luso", "elusa", "leluka", "lelumai", "eluthen"]');`)
    await runDML(db, `INSERT INTO terms (term, definition, "case", pos) values ('dynamis', 'potency', 0, 0);`)
    await runDML(db, `INSERT INTO terms (term, definition, "case", pos) values ('onoma', 'name', 0, 0);`)
}


const loadAssignments = async (db) => {
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (1, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (1, 3);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (2, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (3, 2);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (4, 2);`)
}


module.exports = { loadGroups, loadTerms, loadAssignments }

