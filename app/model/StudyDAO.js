const { prepareTerm } = require('./TermDAO')
const { runDML, runInsert, sampleArray, runGet, runIteration, runUpdate, runSelect } = require('./util')

const ORDER_RANDOM = 0
const ORDER_LEXICAL = 1
const ORDER_STUDY_FREQUENCY = 2
const ORDER_STUDY_DATE = 3
const ORDER_STUDY_ACCURACY = 4

class StudyDAO {

    constructor(db) {
        this.db = db
    }

    async init(reset) {

        if (reset) {
            await runDML(this.db, `DROP TABLE IF EXISTS practice_detail;`)
            await runDML(this.db, `DROP TABLE IF EXISTS practice_sets;`)
            await runDML(this.db, `DROP TABLE IF EXISTS term_stats;`)
        }

        await runDML(this.db, `
            CREATE TABLE IF NOT EXISTS practice_sets (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                start_time INTEGER NOT NULL,
                mode INTEGER NOT NULL CHECK (mode in (0, 1, 2)),
                check_accents INTEGER NOT NULL CHECK (check_accents in (0, 1)),
                full_lexical INTEGER NOT NULL CHECK (full_lexical in (0, 1)),
                total_terms INTEGER NOT NULL DEFAULT 0,
                incorrect INTEGER NOT NULL DEFAULT 0,
                completed_time INTEGER                
            );        
        `)

        await runDML(this.db, `
            CREATE TABLE IF NOT EXISTS practice_detail (
                term_id INTEGER NOT NULL,
                set_id INTEGER NOT NULL,
                attempt INTEGER NOT NULL DEFAULT 0 CHECK (attempt in (0, 1, 2)),
                PRIMARY KEY (term_id, set_id),
                FOREIGN KEY (term_id) REFERENCES terms (id),
                FOREIGN KEY (set_id) REFERENCES practice_sets (id)                
            );
        `)

        await runDML(this.db, `
                CREATE TABLE IF NOT EXISTS term_stats (
                    term_id INTEGER NOT NULL PRIMARY KEY,
                    last_reviewed INTEGER,
                    incorrect_count INTEGER DEFAULT 0,
                    correct_count INTEGER DEFAULT 0,
                    total_count INTEGER DEFAULT 0,
                    FOREIGN KEY (term_id) REFERENCES terms (id)
                );
        `)
    }

    async op(name, args) {
        switch (name) {
            case 'create': return await this.createSet(args[0])
            case 'cancel': return await this.cancelSet()
            case 'get': return await this.getSet(true)
            case 'next': return await this.nextTerm()
            case 'attempt': return await this.attemptTerm(args[0], args[1])
            default: throw Error(`Invalid operation: ${name}`)
        }
    }

    async createSet(setInfo) {
        try {
            const result = await runGet(this.db, `
                select count (*) as count from practice_sets
                where completed_time is null
            `)
            if (result.count > 0) {
                return [false, { message: 'There is already a set in progress. Cancel it before starting another.' }]
            }

            const { mode, checkAccents, fullLexical, group, pos, limit, sort, ordering } = setInfo

            let query = null

            let baseQuery = `
            select terms.id, group_concat(group_id, ',') as groups from terms
            left join group_detail
                on terms.id = group_detail.term_id 
            left join term_stats
                on terms.id = term_stats.term_id                            
            where (${pos} = -1 or terms.pos = ${pos})
            group by terms.id
            having (${group} = -1 or groups like '%${group}%') 
        `
            let limitClause = limit === -1 ? '' : `limit ${limit}`
            let orderFlag = ordering === 0 ? 'ASC' : 'DESC'
            let indices = null

            if (sort === ORDER_RANDOM) {
                query = baseQuery
                if (limit !== -1) {
                    const { count } = await runGet(this.db, `select count (*) as count from (${baseQuery})`)
                    const arr = [...Array(count).keys()]
                    indices = sampleArray(arr, limit)
                }
            }
            else if (sort === ORDER_LEXICAL) {
                query = `
                ${baseQuery}
                order by terms.term ${orderFlag}                
                ${limitClause}
            `
            }
            else if (sort === ORDER_STUDY_FREQUENCY) {
                query = `
                ${baseQuery}
                order by COALESCE(term_stats.total_count, 0) ${orderFlag}
                ${limitClause}
            `
            }
            else if (sort === ORDER_STUDY_DATE) {
                query = `
                ${baseQuery}
                order by COALESCE(term_stats.last_reviewed, 0) ${orderFlag}
                ${limitClause}
            `
            } else if (sort === ORDER_STUDY_ACCURACY) {
                query = `
                ${baseQuery}
                order by COALESCE(
                    COALESCE(CAST(term_stats.correct_count as DOUBLE), 0) /
                    COALESCE(CAST(term_stats.total_count as DOUBLE), 0), 1
                ) ${orderFlag}
                ${limitClause}
            `
            }

            const setId = await runInsert(this.db, `
                insert into practice_sets (
                    start_time, mode, check_accents, full_lexical
                ) values (?, ?, ?, ?);
            `, [new Date() * 1, mode, checkAccents, fullLexical])

            let index = 0
            let promises = []

            let stmt = await new Promise((resolve, reject) => {
                const s = this.db.prepare(`insert into practice_detail (term_id, set_id) values (?, ?)`, err => {
                    if (err) reject(err)
                    else resolve(s)
                })
            })

            const insertFunc = (err, row) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                let i = index++
                if (indices && !indices.includes(i)) return
                const id = row.id

                promises.push(new Promise((resolve, reject) => {
                    stmt.bind([id, setId]).run(err => {
                        if (err) { reject(err) }
                        else resolve()
                    })
                }))
            }


            await runIteration(this.db, query, [], insertFunc)

            await Promise.all(promises)
            await runUpdate(this.db, `update practice_sets set total_terms = ? where id = ?`, [index, setId])

            return [true, promises.length]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }


    async cancelSet() {
        try {
            const set = await this.getSet()
            const termsDeleted = await runUpdate(this.db, `delete from practice_detail where set_id = ?`, [set.id])
            const setsDeleted = await runUpdate(this.db, `delete from practice_sets where id = ?`, [set.id])
            return [true, termsDeleted, setsDeleted]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async completeSet() {
        const set = await this.getSet()
        const results = await runSelect(this.db, `
                select attempt, count(*) as count from practice_detail
                where set_id = ?
                group by attempt                
            `, [set.id])

        
        const unAttempted = results.filter(r => r.attempt === 0).length
        if (unAttempted > 0) return [false, { message: 'Set not complete' }]

        const incorrect = results.filter(r => r.attempt === 2)[0].count

        await runUpdate(this.db, `delete from practice_detail where set_id = ?`, [set.id])
        await runUpdate(this.db, `update practice_sets set completed_time = ?, incorrect = ? where id = ?`,
            [new Date() * 1, incorrect, set.id])

    }

    async getSet(wrap) {

        const prom = runGet(this.db, `
            select * from practice_sets 
            order by coalesce(completed_time, 33254194817000) desc
            limit 1
        `)

        if (wrap) {
            try {
                const result = await prom
                return [true, result]
            }
            catch (err) {
                console.log(err)
                return [false, err]
            }
        }
        else {
            return await prom
        }
    }

    async nextTerm() {
        const set = await this.getSet()
        try {
            const line = await runGet(this.db, `select * from practice_detail where attempt = 0 and set_id = ? limit 1`, [set.id])
            const term = await runGet(this.db, `select * from terms where id = ?`, [line.term_id])
            return [true, line, prepareTerm(term)]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }

    async attemptTerm(term, result) {
        const set = await this.getSet()
        if (![1, 2].includes(result)) {
            return [false, { message: 'Result must be correct or incorrect' }]
        }
        try {
            await runUpdate(this.db, `update practice_detail set attempt = ? where set_id = ? and term_id = ?`,
                [result, set.id, term])
            
            // Check if set is complete
            const { count } = await runGet(this.db, `select count (*) as count from practice_detail where attempt = 0 and set_id = ?`, [set.id])
            if (count === 0) {
                await this.completeSet()
            }
            return [true, count]
        }
        catch (err) {
            console.log(err)
            return [false, err]
        }
    }
}

module.exports = StudyDAO