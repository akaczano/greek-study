export const alphabet = {
    'alpha': 0,
    'beta': 1,
    'gamma': 2,
    'delta': 3,
    'epsilon': 4,
    'zeta': 5,
    'eta': 6,
    'theta': 7,
    'iota': 8,
    'kappa': 9,
    'lambda': 10,
    'mu': 11,
    'nu': 12,
    'xi': 13,
    'omicron': 14,
    'pi': 15,
    'rho': 16,
    'sigma': 17,
    'varsigma': 17,
    'tau': 18,
    'upsilon': 19,
    'phi': 20,
    'chi': 21,
    'psi': 22,
    'omega': 23

}
export const NONE = 1;
export const SMOOTH = 2;
export const ROUGH = 3;
export const ACUTE = 2;
export const GRAVE = 3;
export const CIRCUMFLEX = 4;
export const IOTA = 2;

//const expandCircumflex = l => [l[0], null, l[1], l[2], null, l[3], l[4]]
const expandSubscript = l => [l[0], null, l[1], null, null, null, l[2]]

const lists = [
    [['\u03B1', '\u03B5', '\u03B7', '\u03B9', '\u03BF', '\u03C5', '\u03C9'], NONE, NONE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F00', 16) + 16 * i).map(c => String.fromCharCode(c)), SMOOTH, NONE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F01', 16) + 16 * i).map(c => String.fromCharCode(c)), ROUGH, NONE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F02', 16) + 16 * i).map(c => String.fromCharCode(c)), SMOOTH, GRAVE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F03', 16) + 16 * i).map(c => String.fromCharCode(c)), ROUGH, GRAVE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F04', 16) + 16 * i).map(c => String.fromCharCode(c)), SMOOTH, ACUTE, NONE],
    [Array.from({ length: 7 }, (_, i) => parseInt('1F05', 16) + 16 * i).map(c => String.fromCharCode(c)), ROUGH, ACUTE, NONE],
    [['\u1F06', '\u1F10', '\u1F26', '\u1F36', '\u1F40', '\u1F56', '\u1F66'], SMOOTH, CIRCUMFLEX, NONE],
    [['\u1F07', '\u1F11', '\u1F27', '\u1F37', '\u1F41', '\u1F57', '\u1F67'], ROUGH, CIRCUMFLEX, NONE],
    [Array.from({ length: 7 }, (x, i) => parseInt('1F70', 16) + i * 2 + 1).map(c => String.fromCharCode(c)), NONE, ACUTE, NONE],
    [Array.from({ length: 7 }, (x, i) => parseInt('1F70', 16) + i * 2).map(c => String.fromCharCode(c)), NONE, GRAVE, NONE],
    [['\u1FB6', null, '\u1FC6', '\u1FD6', null, '\u1FE6', '\u1FF6'], NONE, CIRCUMFLEX, NONE],
    [expandSubscript(['\u1FB3', '\u1FC3', '\u1FF3']), NONE, NONE, IOTA],
    [expandSubscript(['\u1FB4', '\u1FC4', '\u1FF4']), NONE, ACUTE, IOTA],
    [expandSubscript(['\u1FB2', '\u1FC2', '\u1FF2']), NONE, GRAVE, IOTA],
    [expandSubscript(['\u1FB7', '\u1FC7', '\u1FF7']), NONE, CIRCUMFLEX, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F80', 16) + i * 16).map(c => String.fromCharCode(c))), SMOOTH, NONE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F81', 16) + i * 16).map(c => String.fromCharCode(c))), ROUGH, NONE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F82', 16) + i * 16).map(c => String.fromCharCode(c))), SMOOTH, GRAVE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F83', 16) + i * 16).map(c => String.fromCharCode(c))), ROUGH, GRAVE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F84', 16) + i * 16).map(c => String.fromCharCode(c))), SMOOTH, ACUTE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F85', 16) + i * 16).map(c => String.fromCharCode(c))), ROUGH, ACUTE, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F86', 16) + i * 16).map(c => String.fromCharCode(c))), SMOOTH, CIRCUMFLEX, IOTA],
    [expandSubscript([0, 1, 2].map(i => parseInt('1F87', 16) + i * 16).map(c => String.fromCharCode(c))), ROUGH, CIRCUMFLEX, IOTA]
]

export const isVowel = c => {
    for (const [list] of lists) {
        if (list.includes(c.toLowerCase())) return true
    }
    return false
}  

export const mapVowel = (v, update) => {        
        const c = v.toLowerCase()
        let index = 0
        let state = {}
        for (const [list, bm, accent, subscript] of lists) {
            if (list.includes(c)) {
                state.bm = bm
                state.accent = accent
                state.subscript = subscript
                index = list.indexOf(c)
                break
            }            
        }
        if (update.bm) {
            state.bm = update.bm
        }
        if (update.subscript) {
            state.subscript = update.subscript
        }
        if (update.accent) {
            state.accent = update.accent
        }        
        let target = ''
        for (const [list, bm, accent, subscript] of lists) {
            if (bm === state.bm && accent === state.accent && subscript === state.subscript) {                
                target = list[index]
                break
            }
        }
        if (target) {
            if (c !== v) target = target.toUpperCase()
            return target
        }
        
        return v
    }


export const removeAccents = text => {    
    let newText = ''
    for (let i = 0; i < text.length; i++) {
        const c = text.charAt(i)
        if (isVowel(c)) {
            newText += mapVowel(c, {accent: NONE})
        }
        else {
            newText += c
        }
    }
    return newText
}

export const compareTypes = (a, b) => {
    if (a === b) return 0;
    else if (a === 'verb') return -1;
    else if (b === 'verb') return 1;
    else if (a === 'noun') return -1;
    else if (b === 'noun') return 1;
    else if (a === 'adjective') return -1;
    else if (b === 'adjective') return 1;
    return 0;
}

export const compareGreek = (a, b) => a.localeCompare(b)

export const compareGreekf = (a, b) => {    
    let apure = removeAccents(a).substring(1)
    let bpure = removeAccents(b).substring(1)



    while (true) {
        if (apure.length === 0 && bpure.length > 0) {
            return -1
        }
        else if (apure.length > 0 && bpure.length === 0) {
            return 1
        }
        else if (apure.length === 0 && bpure.length === 0) {
            return 0
        }

        const extractLetter = s => {
            const index = s.indexOf('\\')
            if (index < 0) {
                return [s, '']
            }
            else {
                return [s.substring(0, index), s.substring(index + 1)]
            }
        }

        const [aletter, newa] = extractLetter(apure)
        const [bletter, newb] = extractLetter(bpure)
        const aindex = alphabet[aletter]
        const bindex = alphabet[bletter]
        apure = newa
        bpure = newb
        if (aindex === bindex) continue
        return aindex - bindex
    }
}


export const defaultCommands = ["'", "\"", "/", "`", "~", "_"]    

export const defaultKeys = ['a', 'b', 'g', 'd', 'e', 'z', 'y', 'h', 'i', 'k', 'l', 'm', 'n',
                            'x', 'o', 'p', 'r', 's', 'q', 't', 'u', 'f', 'c', 'v', 'w']

export const lowerCaseLetters = Array.from({ length: 25 }, (x, i) => i + parseInt('0x03B1', 16)).map(s => String.fromCharCode(s))
export const capitalLetters = Array.from({ length: 25 }, (x, i) => i + parseInt('0x0391', 16)).map(s => String.fromCharCode(s))