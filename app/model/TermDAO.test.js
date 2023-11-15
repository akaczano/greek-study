const sqlite3 = require('sqlite3').verbose()
const { TermDAO } = require('./TermDAO')

const testFile = 'test.db'
const { loadTerms, loadAssignments, loadGroups, resetDatabase } = require('./test-util')


let dao = null


beforeEach(async () => {
    const db = new sqlite3.Database(testFile)

    dao = new TermDAO(db)
    try {
        await resetDatabase(db)        
        await loadGroups(db)
        await loadTerms(db)
        await loadAssignments(db)
    }
    catch (err) {
        console.log(err)
        throw err
    }    
})

test('test unfiltered list', async () => {
    let [status1, result1, count] = await dao.op('list', [0, 10, { pos: -1 }])
    expect(status1).toBe(true)
    expect(result1.length).toBe(6)
    expect(count).toBe(6)

    let [status2, result2, count2] = await dao.op('list', [0, 3, { pos: -1 }])
    expect(status2).toBe(true)
    expect(result2.length).toBe(3)
    expect(count2).toBe(6)
    let list = result2.map(t => t.term)
    expect(list.includes('dynamis')).toBe(true)
    expect(list.includes('logos')).toBe(true)
    expect(list.includes('fusis')).toBe(true)
    let [status3, result3] = await dao.op('list', [3, 3, { pos: -1n }])
    expect(status3).toBe(true)
    expect(result3.length).toBe(3)
    list = result3.map(t => t.term)
    expect(list.includes('luo')).toBe(true)
    expect(list.includes('thaumazo')).toBe(true)
    expect(list.includes('onoma')).toBe(true)

    const luo = result3.filter(t => t.term === 'luo')[0]
    expect(luo.pps).toStrictEqual(['luo', 'luso', 'elusa', 'leluka', 'lelumai', 'eluthen'])

})

test('test filter term', async () => {
    let [status, list] = await dao.op('list', [0, 10, {
        termFilter: 'is',
        pos: -1
    }])
    expect(status).toBe(true)
    expect(list.length).toBe(2)
    expect(list.filter(t => t.term.includes('is')).length).toBe(2)
})

test('test filter definition', async () => {
    let [status, list, count] = await dao.op('list', [0, 10, {
        definitionFilter: 'loosen',
        pos: -1
    }])
    expect(status).toBe(true)
    expect(list.length).toBe(1)
    expect(count).toBe(1)
    expect(list.filter(t => t.definition.includes('loosen')).length).toBe(1)
})

test('test filter pos', async () => {
    let [status, list] = await dao.op('list', [0, 10, {
        pos: 1
    }])
    expect(status).toBe(true)
    expect(list.length).toBe(2)
    expect(list.filter(t => t.term === 'luo').length).toBe(1)
    expect(list.filter(t => t.term === 'thaumazo').length).toBe(1)
})

test('test filter group', async () => {
    let [status, list] = await dao.op('list', [0, 10, {
        pos: -1,
        group: 2
    }])
    expect(status).toBe(true)
    expect(list.length).toBe(2)
    expect(list.filter(t => t.term === 'luo').length).toBe(1)
    expect(list.filter(t => t.term === 'thaumazo').length).toBe(1)
})

test('test insert', async () => {
    let [status] = await dao.op('add', [{
        term: 'psuche',
        definition: 'soul',
        case: 1,
        pos: 4,
        pps: ['a', 'b', 'c', 'd', 'e', 'f'],
        notes: 'here are some notes',
        groups: [1, 3]
    }])
    expect(status).toBe(true)
    let [status1, list] = await dao.op('list', [0, 10, { pos: -1 }])
    expect(status1).toBe(true)
    expect(list.length).toBe(7)
    
    expect(list.filter(t => t.term === "psuche").length).toBe(1)
    const term = list.filter(t => t.term === "psuche")[0]
    expect(term.case).toBe(1)
    expect(term.pos).toBe(4)
    expect(term.notes).toBe("here are some notes")
    expect(term.groups).toStrictEqual([1, 3])
    expect(term.pps).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f'])
})

test('test delete', async () => {
    let [status, detailCount, termCount] = await dao.op('remove', [1])
    expect(status).toBe(true)
    expect(detailCount).toBe(2)
    expect(termCount).toBe(1)
    let [status2, list] = await dao.op('list', [0, 10, { pos: -1 }])
    expect(status2).toBe(true)
    expect(list.length).toBe(5)
})

test('test update', async () => {
    let [status, count] = await dao.op('update', [{
        id: 1,
        term: 'psuche',
        definition: 'soul',
        case: 1,
        pos: 4,
        pps: '["", "", "", "", "", ""]',
        notes: 'here are some notes',
        groups: [1, 2]
    }])
    expect(status).toBe(true)
    expect(count).toBe(1)
    let [status1, list] = await dao.op('list', [0, 10, { pos: -1 }])
    expect(status1).toBe(true)
    expect(list.length).toBe(6)
    
    expect(list.filter(t => t.term === "psuche").length).toBe(1)
    const term = list.filter(t => t.term === "psuche")[0]
    
    expect(term.case).toBe(1)
    expect(term.pos).toBe(4)
    expect(term.notes).toBe("here are some notes")
    expect(term.groups).toStrictEqual([1, 2])
})
