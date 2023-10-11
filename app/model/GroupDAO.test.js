const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const GroupDAO = require('./GroupDAO')

const testFile = 'test.db'
const { loadGroups } = require('./test-util')

let dao = null


beforeEach(async () => {
    const db = new sqlite3.Database(testFile)
    dao = new GroupDAO(db)
    try {
        await dao.init(true)
        await loadGroups(db)
    }
    catch (err) {
        console.log(err)
        throw err
    }
    
})


test('test list groups', async () => {
    const [result, list] = await dao.op('list', [])
    expect(result).toBe(true)
    expect(list.length).toBe(3)
    expect(list.map(e => e.description).filter(e => e === 'Group 1').length).toBe(1)
    expect(list.map(e => e.description).filter(e => e === 'Grouf 1').length).toBe(0)
})

test('test insert group', async () => {
    const [result, id] = await dao.op('add', ['test group 4'])
    expect(result).toBe(true)
    expect(id).toBe(4)
    const [listResult, list] = await dao.op('list', [])
    expect(listResult).toBe(true)
    expect(list.length).toBe(4)
    expect(list.map(e => e.description).filter(e => e === 'test group 4').length).toBe(1)
})

test('test update group', async () => {
    await dao.op('update', [1, 'updated groupf'])
    const [result, changes] = await dao.op('update', [1, 'updated group'])
    expect(result).toBe(true)
    expect(changes).toBe(1)
    const [listResult, list] = await dao.op('list', [])
    expect(listResult).toBe(true)
    expect(list.length).toBe(3)
    expect(list.map(e => e.description).filter(e => e === 'Group 1').length).toBe(0)
    expect(list.map(e => e.description).filter(e => e === 'updated group').length).toBe(1)
})

test('test remove group', async () => {
    const [result, changes] = await dao.op('remove', [1])
    expect(result).toBe(true)
    expect(changes).toBe(1)
    const [listResult, list] = await dao.op('list', [])
    expect(listResult).toBe(true)
    expect(list.length).toBe(2)
    expect(list.map(e => e.description).filter(e => e === 'Group 1').length).toBe(0)
})