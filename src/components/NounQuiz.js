import { useState, useEffect } from 'react'
import { removeAccents } from '../util/greek'
import { Row } from 'react-bootstrap'
import { Container, Typography, Card, CardContent, CardActions, Button, MenuItem, TextField, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { updateText } from '../util/input'
import { go, NOUNS } from '../state/navSlice'

const getCase = i => ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'][i % 5]

const getNumber = i => i < 5 ? 'Singular' : 'Plural'

function NounQuiz(props) {
    const dispatch = useDispatch()
    const vocab = useSelector(state => state.content.content.chapters)
    const charts = useSelector(state => state.content.content.declensions)
    const { settings } = useSelector(state => state.nav.params)


    const [total, setTotal] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [generator, setGenerator] = useState(null)
    const [term, setTerm] = useState(null)
    const [wrong, setWrong] = useState(false)
    const [show, setShow] = useState(false)

    const [textInput, setTextInput] = useState('')
    const [caseInput, setCaseInput] = useState(0)
    const [numberInput, setNumberInput] = useState(0)

    const predicate = pattern => term => {
        const patterns = pattern.split('|')
        for (const p of patterns) {
            if (removeAccents(term.greek).endsWith(removeAccents(p))) return true
        }
        return false
    }


    useEffect(() => {
        let relevantVocab = vocab
            .flatMap(v => v.words)
            .filter(v => v.type == 'noun')
            .filter(v => v.greek.includes(','))
            .filter(v => charts.filter(c => settings.filter == 'all' || settings.filter == c.description).some(c => predicate(c.pattern)(v)))

        const generator = () => {
            const length = relevantVocab.length - 1
            const word = relevantVocab[Math.round(length * Math.random())]
            const caseIndex = Math.floor(Math.random() * 9)

            const chart = charts.filter(c => predicate(c.pattern)(word))[0]
            const pattern = chart.pattern.split('|').filter(p => removeAccents(word.greek).endsWith(removeAccents(p)))[0]
            const ending = chart.chart[caseIndex]


            let greek = removeAccents(word.greek).substring(0, removeAccents(word.greek).indexOf(removeAccents(pattern))) + ending

            if (settings.articles) {
                let articleChart = null;
                if (word.greek.endsWith('ὁ')) {
                    articleChart = charts.filter(c => c.pattern == 'Μ')[0]
                }
                else if (word.greek.endsWith('ἡ')) {
                    articleChart = charts.filter(c => c.pattern == 'Φ')[0]
                }
                else {
                    articleChart = charts.filter(c => c.pattern == 'Ν')[0]
                }
                if (articleChart) {
                    console.log(articleChart)
                    greek = articleChart.chart[caseIndex] + ' ' + greek
                }
            }

            const english = settings.articles ? ([4, 9].includes(caseIndex) ? 'Oh ' : 'the ') + word.english : word.english

            return {
                greek, caseIndex, english: english
            }

        }
        setGenerator(() => generator)

    }, [settings])


    useEffect(() => {
        if (generator) {
            setTerm(generator())
        }
    }, [generator, total])

    const displayPrompt = () => {
        if (!term) return null


        if (settings.mode == 0) {
            return <Typography variant="h5" style={{ fontFamily: 'Tahoma' }}>{term?.greek}</Typography>
        }
        else if (settings.mode == 1) {
            return (<div style={{ marginBottom: '12px' }}>
                <span>{term?.english}</span>
                <em style={{ fontSize: '15px', marginLeft: '5px', color: 'gray' }}>in the {getCase(term.caseIndex)} {getNumber(term.caseIndex)}</em>
            </div>)
        }
    }

    const check = () => {
        if (show) {
            setWrong(false)
            setShow(false)
            setIncorrect(incorrect + 1)
            setTotal(total + 1)
            setTextInput('')
            setCaseInput(0)
            setNumberInput(0)
            return
        }
        let correct = false
        if (settings.mode == 0) {
            correct = textInput.toUpperCase(0) == term.english.toUpperCase() && (caseInput + (5 * numberInput)) == term.caseIndex
        }
        else if (settings.mode == 1) {
            correct = removeAccents(textInput) == removeAccents(term.greek)
        }

        if (correct) {
            setWrong(false)
            setTotal(total + 1)
            setTextInput('')
            setCaseInput(0)
            setNumberInput(0)
        }
        else {
            setWrong(true)
        }
    }

    const displayInput = () => {
        if (settings.mode == 0) {
            if (show) {
                return (
                    <Grid container>
                        <Grid item>
                            {term.english}
                        </Grid>
                        <Grid item>
                            {getCase(term.caseIndex % 5)}
                        </Grid>
                        <Grid item>
                            {getNumber(term.caseIndex)}
                        </Grid>
                    </Grid>
                )
            }
            return (
                <Grid container columnSpacing={1} sx={{ marginTop: '10px'}}>
                    <Grid item md={3} xs={4}>
                        <TextField
                            size="small"
                            value={textInput}
                            fullWidth
                            onChange={e => setTextInput(e.target.value)}
                            label='translation' />
                    </Grid>
                    <Grid item md={3} xs={4}>
                        <TextField size="small" select value={caseInput} onChange={e => setCaseInput(parseInt(e.target.value))} fullWidth label="Case">
                            <MenuItem value={0}>Nominative</MenuItem>
                            <MenuItem value={1}>Genitive</MenuItem>
                            <MenuItem value={2}>Dative</MenuItem>
                            <MenuItem value={3}>Accusative</MenuItem>
                            <MenuItem value={4}>Vocative</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item md={3} xs={4}>
                        <TextField select value={numberInput} onChange={e => setNumberInput(parseInt(e.target.value))} size="small" fullWidth label="Number">
                            <MenuItem value={0}>Singular</MenuItem>
                            <MenuItem value={1}>Plural</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item md={3} xs={0}></Grid>
                </Grid>
            )
        }
        else if (settings.mode == 1) {
            if (show) {
                return term.greek
            }
            return (
                <TextField
                    size="small"
                    label="Greek"
                    value={textInput}
                    inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" } }}
                    onChange={e => setTextInput(updateText(e))} />
            )
        }
    }

    return (

        <Container>

            <Typography variant="h5">Noun practice</Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6">{displayPrompt()}</Typography>
                    {displayInput()}
                    <br /> {wrong ? (<p style={{ color: 'red' }}>Incorrect</p>) : null}
                </CardContent>
                <CardActions>
                    <Button variant="outlined" onClick={check}>{show ? 'Next' : 'Check'}</Button>
                    <Button variant="outlined" onClick={() => setShow(true)}>Show Answer</Button>
                    <Button variant="outlined" color="secondary" onClick={() => dispatch(go([NOUNS, {}]))}>Back to chart list</Button>
                </CardActions>
            </Card>

        </Container>

    )
}

export default NounQuiz