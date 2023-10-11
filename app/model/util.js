const runSelect = async (db, query) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(rows)
            }
        })
    })
    return await queryPromise
} 


const runInsert = async (db, query, params) => {
    const promise = new Promise((resolve, reject) => {
        const stmt = db.prepare(query).bind(params).run(err => {
            console.log(stmt)
            if (err) reject(err)
            else resolve(stmt.lastID)
        })
    })
    return promise    
}

const runUpdate = async (db, query, params) => {
    const promise = new Promise((resolve, reject) => {
        const stmt = db.prepare(query).bind(params).run(err => {
            console.log(stmt)
            if (err) reject(err)
            else resolve(stmt.changes)
        })
    })
    return promise    
}


const runDML = (db, query) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.run(query, err => {
            if (err) reject(err)
            else resolve()
        })
    })
    return queryPromise
}


module.exports = { runSelect, runDML, runInsert, runUpdate }