import { removeAccents } from "./greek"

export const checkEnglish = (expected, actual) => {

    const removeParens = str => {
        let depth = 0
        let result = ''
        for (const c of str) {
            if (c === '(') depth++
            else if (c === ')') depth--
            else if (depth === 0) result += c
        }
        return result
    }

    const process = arr => {
        arr.map(t => t.trim())
            .filter(t => t !== 'to')
            .map(t => {
                if (t.includes('/')) {
                    const sides = t.split('/')
                    if (sides[0].localeCompare(sides[1]) < 0) {
                        return `${sides[1]}/${sides[0]}`
                    }
                }
                return t
            })
    }

    let expDefs = removeParens(expected).split(';')
    let actDefs = removeParens(actual).split(':')    

    if (expDefs.length !== actDefs.length) return false

    for (const def of expDefs) {
        let terms = process(def.split(','))
        let matchingTerms = null
        for (const actDef of actDefs) {
            if (actDef.includes(terms[0])) {
                matchingTerms = process(actDef.split(','))
            }
            if (!matchingTerms) return false
            if (matchingTerms.length != terms.length) return false
            for (const term of terms) {
                if (!matchingTerms.includes(term)) return false
            }
        }
    }

    return true
}

export const checkGreek = (expected, actual, accents, full) => {
    let e = accents ? expected : removeAccents(expected)
    let a = accents ? actual : removeAccents(actual)
    e = full ? e : e.split(',')[0]
    a = full ? a : a.split(',')[0]
    return e === a
}