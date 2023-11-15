const sqlite3 = require('sqlite3').verbose()
const StudyDAO = require('./StudyDAO')
const { loadStudyData, resetDatabase } = require('./test-util')
const { runSelect, runGet } = require('./util')

const testFile = 'test.db'
const defaults = {
    mode: 0,
    checkAccents: 0,
    fullLexical: 0,
    group: -1,
    pos: -1,
    limit: 5,
    sort: 0,
    ordering: 0
}

let db = null
let dao  = null

beforeEach(async () => {
    db = new sqlite3.Database(testFile)

    dao = new StudyDAO(db)
    try {
        await resetDatabase(db)
        await loadStudyData(db)
    }
    catch (err) {
        console.log(err)
        throw err
    }    
})

test('test random selection', async () => {
    const [status, count] = await dao.op('create', [defaults])
    expect(status).toBe(true)
    expect(count).toBe(5)
    const rows = await runSelect(db, 'select * from practice_detail')
    expect(rows.length).toBe(5)
})

test('test large limit', async () => {
    const [status1, count1] = await dao.op('create', [{ ...defaults, limit: 30 }])
    expect(status1).toBe(true)
    expect(count1).toBe(10)
})

test('test group filter', async () => {        
    const [status2, count2] = await dao.op('create', [{ ...defaults, limit: 30, group: 1 }])
    expect(status2).toBe(true)
    expect(count2).toBe(5)    
    for (const row of (await runSelect(db, `select * from practice_detail`))) {
        const { count } = await runGet(db, `select count(*) as count from group_detail where term_id = ? and group_id = ?`, [row.term_id, 1])
        expect(count).toBe(1)
    }
})

test('test pos filter', async () => {
    const [status2, count2] = await dao.op('create', [{ ...defaults, limit: 30, pos: 1 }])
    expect(status2).toBe(true)
    expect(count2).toBe(5)  
    for (const row of (await runSelect(db, `select * from practice_detail`))) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(term.pos).toBe(1)
    }  
})

test('test lexical ordering asc', async() => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 1, ordering: 0, limit: 3}])
    expect(status).toBe(true)
    expect(count).toBe(3)
    
    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(3)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term1', 'term2', 'term10'].includes(term.term)).toBe(true)
    }
})

test('test lexical ordering asc', async() => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 1, ordering: 1, limit: 3}])
    expect(status).toBe(true)
    expect(count).toBe(3)
    
    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(3)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term8', 'term9', 'term7'].includes(term.term)).toBe(true)
    }
})

test('test frequency ordering asc', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 2, ordering: 0, limit: 4, pos: 0}])
    expect(status).toBe(true)
    expect(count).toBe(4)
    
    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(4)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term1', 'term3', 'term7', 'term5'].includes(term.term)).toBe(true)
    }
})


test('test frequency ordering with missing data', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 2, ordering: 0, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)
    
    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(5)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term2', 'term4', 'term6', 'term8', 'term10'].includes(term.term)).toBe(true)
    }
})

test('test date ordering asc', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 3, ordering: 0, limit: 3, pos: 0 }])
    expect(status).toBe(true)
    expect(count).toBe(3)

    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(3)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term7', 'term5', 'term9'].includes(term.term)).toBe(true)
    }
})

test('test date ordering missing data', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 3, ordering: 0, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)

    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(5)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term2', 'term4', 'term6', 'term8', 'term10'].includes(term.term)).toBe(true)
    }
})

test('test date ordering missing data desc', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 3, ordering: 1, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)

    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(5)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term1', 'term3', 'term5', 'term7', 'term9'].includes(term.term)).toBe(true)
    }
})

test('test accuracy ordering asc', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 4, ordering: 0, limit: 3, pos: 0 }])
    expect(status).toBe(true)
    expect(count).toBe(3)

    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(3)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term7', 'term5', 'term9'].includes(term.term)).toBe(true)
    }
})

test('test accuracy ordering missing data', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 4, ordering: 0, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)

    const rows = await runSelect(db, `select * from practice_detail`)
    expect(rows.length).toBe(5)
    for (const row of rows) {
        const term = await runGet(db, `select * from terms where id = ?`, [row.term_id])
        expect(['term1', 'term3', 'term5', 'term7', 'term9'].includes(term.term)).toBe(true)
    }
})

test('test fail on duplicate set', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 4, ordering: 0, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)
    const [status2, err] = await dao.op('create', [{ ...defaults, sort: 4, ordering: 0, limit: 5}])
    expect(status2).toBe(false)
    expect(err.message).toContain('already a set')
})

test('test cancel set', async () => {
    const [status, count] = await dao.op('create', [{ ...defaults, sort: 4, ordering: 0, limit: 5}])
    expect(status).toBe(true)
    expect(count).toBe(5)

    const [delStatus] = await dao.op('cancel')
    expect(delStatus).toBe(true)    
    const sets = await runSelect(db, `select * from practice_sets`)
    expect(sets.length).toBe(0)
    const details = await runSelect(db, `select * from practice_sets`)
    expect(details.length).toBe(0)
})


test('test study flow', async () => {
    const startTime = new Date()
    const [createStatus, createCount] = await dao.op('create', [{ ...defaults, limit: -1 }])
    expect(createStatus).toBe(true)
    expect(createCount).toBe(10)

    const [setStatus, set] = await dao.op('get')
    expect(setStatus).toBe(true)
    expect(set.start_time).toBeGreaterThanOrEqual(startTime * 1)

    let counter = 0
    while (counter < 10) {        
        const [status, line, term] = await dao.op('next')
        expect(status).toBe(true)
        const [result, remaining] = await dao.op('attempt', [term.id, counter % 2 + 1])
        expect(result).toBe(true)        
        expect(remaining).toBe(10 - ++counter)
    }

    const [setStatusFinal, finalSet] = await dao.op('get')
    expect(setStatusFinal).toBe(true)
    expect(finalSet.completed_time).toBeGreaterThan(startTime * 1)
    expect(finalSet.total_terms).toBe(10)
    expect(finalSet.incorrect).toBe(5)

})