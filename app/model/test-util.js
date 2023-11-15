const GroupDAO = require('./GroupDAO')
const { TermDAO } = require('./TermDAO')
const StudyDAO = require('./StudyDAO')
const { runDML } = require('./util')

const resetDatabase = async (db) => {
    await new GroupDAO(db).init(true)
    await new TermDAO(db).init(true)
    await new StudyDAO(db).init(true)
}

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

const loadStudyData = async (db) => {

    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (1, 'term1', '', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (2, 'term2', '', 0, 1);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (3, 'term3', '', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (4, 'term4', '', 0, 1);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (5, 'term5', '', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (6, 'term6', '', 0, 1);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (7, 'term7', '', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (8, 'term8', '', 0, 1);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (9, 'term9', '', 0, 0);`)
    await runDML(db, `INSERT INTO terms (id, term, definition, "case", pos) values (10, 'term10', '', 0, 1);`)

    await runDML(db, `INSERT INTO groups (id, description) values (1, 'group1');`)
    await runDML(db, `INSERT INTO groups (id, description) values (2, 'group2');`)
    
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (1, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (2, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (3, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (4, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (5, 1);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (6, 2);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (7, 2);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (8, 2);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (9, 2);`)
    await runDML(db, `INSERT into group_detail (term_id, group_id) values (10, 2);`)


    await runDML(db, `INSERT INTO term_stats (term_id, last_reviewed, correct_count, total_count) values (1, ${new Date('2023/10/4') * 1}, 9, 10)`)
    await runDML(db, `INSERT INTO term_stats (term_id, last_reviewed, correct_count, total_count) values (3, ${new Date('2023/10/8') * 1}, 15, 20)`)
    await runDML(db, `INSERT INTO term_stats (term_id, last_reviewed, correct_count, total_count) values (5, ${new Date('2023/5/10') * 1}, 12, 30)`)
    await runDML(db, `INSERT INTO term_stats (term_id, last_reviewed, correct_count, total_count) values (7, ${new Date('2023/6/8') * 1}, 7, 40)`)
    await runDML(db, `INSERT INTO term_stats (term_id, last_reviewed, correct_count, total_count) values (9, ${new Date('2023/9/25') * 1}, 5, 50)`)

}


module.exports = { resetDatabase, loadGroups, loadTerms, loadAssignments, loadStudyData }

