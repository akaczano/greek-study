import { Form } from 'react-bootstrap'
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
} from '../util/greek'


function GreekInput(props) {

    const keys = localStorage.getItem("greek_keys")?.split(',') || defaultKeys
    const specialKeys = localStorage.getItem("greek_commands")?.split(',') || defaultCommands
    

    const map = {}

    for (let i = 0; i < keys.length * 2; i++) {
        const c = i < keys.length ? keys[i] : keys[i % keys.length].toUpperCase()
        map[c] = i < keys.length ? lowerCaseLetters[i] : capitalLetters[i % keys.length]
    }

    const letterFromKey = key => {

        if (' ,|()'.includes(key)) {
            return key
        }
        else {
            return map[key] ? map[key] : ''
        }
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


    const style = {
        height: '40px',
        fontSize: '20px',
        fontFamily: 'tahoma'
    }
    if (props.invalid) {
        style.border = '1px solid red'
    }

    const textChanged = e => {
        const selection = e.target.value.substring(e.target.selectionStart - 1, e.target.selectionEnd)
        const charEntered = selection.charAt(selection.length - 1)
        console.log(charEntered, map[charEntered])
        if (specialKeys.includes(charEntered) && e.target.selectionStart > 1) {
            const v = e.target.value.charAt(e.target.selectionStart - 2)
            props.onChange(e.target.value.substring(0, e.target.selectionStart - 2) + updateVowel(v, charEntered) + e.target.value.substring(e.target.selectionStart, e.target.length))
            return
        }
        let text = e.target.value
        for (let i = 0; i < keys.length * 2; i++) {
            const key = i < keys.length ? keys[i] : keys[i % keys.length].toUpperCase()
            text = text.replace(key, map[key])
        }
        props.onChange(text)
    }

    return (
        <Form.Control style={style} disabled={props.disabled} onChange={textChanged} value={props.value} />
    )

}

export default GreekInput