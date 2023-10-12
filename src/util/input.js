import {
    mapVowel,
    isVowel,
    SMOOTH,
    ROUGH,
    ACUTE,
    GRAVE,
    CIRCUMFLEX,
    IOTA,
    defaultKeys,
    defaultCommands,
    lowerCaseLetters,
    capitalLetters
} from './greek'



export const updateText = (e, f) => {
    const left = e.target.value.substring(0, e.target.selectionStart - 1)
    const right = e.target.value.substring(e.target.selectionEnd)

    const [text, offset] = transformText(left, e.nativeEvent.data)

    f(text + right)
    return offset
}

export const transformText = (text, c) => {    
    const keys = localStorage.getItem("greek_keys")?.split(',') || defaultKeys
    const specialKeys = localStorage.getItem("greek_commands")?.split(',') || defaultCommands


    const map = {}

    for (let i = 0; i < keys.length * 2; i++) {
        const c = i < keys.length ? keys[i] : keys[i % keys.length].toUpperCase()
        map[c] = i < keys.length ? lowerCaseLetters[i] : capitalLetters[i % keys.length]
    }

    const updateVowel = (v, k) => {
        if (v === '\u03C1' && k === specialKeys[1]) {
            return '\u1FE5'
        }
        else if (v === '\u03A1') {
            return '\u1FEC'
        }
        if (!isVowel(v)) return v
        if (k === specialKeys[0]) {
            return mapVowel(v, { bm: SMOOTH })
        }
        else if (k === specialKeys[1]) {
            return mapVowel(v, { bm: ROUGH })
        }
        else if (k === specialKeys[2]) {
            return mapVowel(v, { accent: ACUTE })
        }
        else if (k === specialKeys[3]) {
            return mapVowel(v, { accent: GRAVE })
        }
        else if (k === specialKeys[4]) {
            return mapVowel(v, { accent: CIRCUMFLEX })
        }
        else if (k === specialKeys[5]) {
            return mapVowel(v, { subscript: IOTA })
        }

    }

    
    
    if (specialKeys.includes(c) && text.length > 0) {
        const v = text.charAt(text.length - 1)
        return [text.substring(0, text.length - 1) + updateVowel(v, c), 1]
    }   

    for (let i = 0; i < keys.length * 2; i++) {
        const key = i < keys.length ? keys[i] : keys[i % keys.length].toUpperCase()
        c = c.replace(key, map[key])
    }
    return [text + c, 0]
}
