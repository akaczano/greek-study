const runSelect = (db, query, params=[]) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.prepare(query, err => { if (err) reject(err) }).bind(params).all((err, rows) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(rows)
            }
        })
    })
    return queryPromise
} 


const runInsert = (db, query, params) => {
    const promise = new Promise((resolve, reject) => {
        const stmt = db.prepare(query, err => { if (err) reject(err) }).bind(params).run(err => {
            if (err) reject(err)
            else resolve(stmt.lastID)
        })
    })
    return promise    
}

const runUpdate = (db, query, params) => {
    const promise = new Promise((resolve, reject) => {
        const stmt = db.prepare(query, err => { if (err) reject(err) }).bind(params).run(err => {            
            if (err) reject(err)
            else resolve(stmt.changes)
        })
    })
    return promise    
}


const runDML = (db, query) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.run(query, err => {
            if (err) { 
                reject(err)
            }
            else resolve()
        })
    })
    return queryPromise
}

const runGet = (db, query, params=[]) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {            
            if (err) reject(err)
            else resolve(row)
        })
    })
    return queryPromise
}


const runIteration = (db, query, params=[], f) => {
    const queryPromise = new Promise((resolve, reject) => {
        db.each(query, params, f, err => { if (err) { reject(err) } else resolve()})
    })
    return queryPromise
}

const sampleArray = ([...arr], n = 1) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n);
  };


module.exports = { runSelect, runDML, runInsert, runUpdate, runGet, runIteration, sampleArray }