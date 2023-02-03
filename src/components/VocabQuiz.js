import { useState } from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    MenuItem,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    Checkbox,
    Switch,
    Stack,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Container,
    Grid
} from '@mui/material'
import Latex from 'react-latex'
import { useDispatch, useSelector } from 'react-redux'

import { removeAccents } from '../util/greek'
import { go, CHAPTER_LIST } from '../state/navSlice'
import { updateText } from '../util/input'
import { Box } from '@mui/system'

const parts = ['verb', 'noun', 'adjective', 'other']
const principalParts = [true, true, true, true, true, true]

function VocabQuiz() {
    const dispatch = useDispatch()
    const description = useSelector(state => state.nav.params.chapterName)
    const chapter = useSelector(state => state.content.content.chapters.filter(c => c.description == description)[0])

    const [words, setWords] = useState([])

    // Quiz settings
    const [showEnglish, setShowEnglish] = useState(true)
    const [pos, setPOS] = useState(parts)
    const [checkAccents, setCheckAccents] = useState(true)
    const [pps, setPPs] = useState(principalParts)

    const [position, setPosition] = useState(0)
    const [complete, setComplete] = useState(false)
    const [failed, setFailed] = useState(false)
    const [input, setInput] = useState('')
    const [caseInput, setCaseInput] = useState('NA')
    const [numFailed, setNumFailed] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [started, setStarted] = useState(false)

    const term = words[position]


    const formatVerb = verbInput => {
        const inputs = verbInput.replace('...', '-,-').split(',')
        let output = ''
        let buffer = ''
        for (let i = 0; i < inputs.length; i++) {
            if (pps[i]) {
                if (output.length > 0) {
                    output += ','
                }
                if (buffer.length > 0) {                    
                    output += buffer + ','
                }
                output += inputs[i]
            }
            else {
                if (buffer.length > 0) {
                    buffer += ','
                }                
                buffer += '?'
            }
        } 
        return output       
    } 

    const check = () => {
        setAttempts(attempts + 1)

        let correct = caseInput == term.takesCase
        if (correct) {
            if (showEnglish) {
                let actual = input
                let expected = term.greek

                if (!checkAccents) {
                    actual = removeAccents(actual)
                    expected = removeAccents(expected)
                }

                if (term.type == 'verb') {
                    expected = formatVerb(expected)
                }                
                correct = actual == expected
                                
            }
            else {
                const correctWords = words[position].english.toLowerCase().replaceAll(';', ',').replaceAll(',', ' ').trim().split(/\s+/)
                const inputWords = input.toLowerCase().replaceAll(';', ',').replaceAll(',', ' ').trim().split(/\s+/)                
                for (const cw of correctWords) {
                    if (!inputWords.includes(cw)) {
                        correct = false
                        break
                    }
                }
            }
        }
        if (correct) {
            setInput('')
            setCaseInput('NA')
            setFailed(false)
            if (position + 1 < words.length) {
                setPosition(position + 1)
            }
            else {
                setComplete(true)
                //props.onComplete(description)
            }
        }
        else {
            setFailed(true)
            setNumFailed(numFailed + 1)
        }
    }

    const reset = () => {
        setInput('')
        setCaseInput('NA')
        setFailed(false)
    }

    const restart = () => {
        setInput('')
        setCaseInput('NA')
        setPosition(0)
        setNumFailed(0)
        setAttempts(0)
        setStarted(false)
        setComplete(false)
    }

    const start = () => {
        setWords(chapter.words
            .slice()
            .filter(t => pos.includes(t.type))
            .sort((a, b) => 0.5 - Math.random()))
        setStarted(true)
    }

    const displayTerm = () => {
        if (showEnglish) {
            return <span>{words[position].english}</span>
        }
        else {
            return <strong style={{ fontFamily: "tahoma" }}>{words[position].greek}</strong>
        }
    }

    const displayInput = () => {
        const onChange = e => {
            if (showEnglish) {
                setInput(updateText(e))
            }
            else {
                setInput(e.target.value)
            }
        }
        return (
            <TextField
                value={input}
                label={showEnglish ? "Greek" : "English"}
                inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" } }}
                sx={{ marginTop: '12px' }}
                onChange={onChange}
                size="small"
                fullWidth />
        )
    }

    const displayAttempt = () => {
        if (showEnglish) {
            return <span style={{fontFamily: 'tahoma', fontSize: '20px'}}>{input}</span>
        }
        else {
            return <span>{input}</span>
        }
    }

    const displayAnswer = () => {
        if (showEnglish) {
            return <span style={{fontSize: '20px', fontFamily: 'tahoma'}}>{term.type == 'verb' ? formatVerb(term.greek) : term.greek}</span>
        }
        else {
            return (<span>{term.english}</span>)
        }
    }



    const renderTerm = () => {

        if (!started) {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Quiz of {description}</Typography>
                        <p>{chapter.words.length} terms</p>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Quiz mode</FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        checked={showEnglish}
                                        control={<Radio />}
                                        label="English to Greek"
                                        onChange={e => setShowEnglish(e.target.checked)}
                                        tabIndex={7} />
                                    <FormControlLabel
                                        checked={!showEnglish}
                                        value={true}
                                        control={<Radio />}
                                        label="Greek to English"
                                        tabIndex={8}
                                        onChange={e => setShowEnglish(!e.target.checked)} />
                                </RadioGroup>
                            </FormControl>
                            <hr />
                            <FormControl>
                                <FormLabel>Parts of speech</FormLabel>
                                <RadioGroup row>
                                    {parts.map(p => (
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            key={`check_${p}`}
                                            label={`${p.charAt(0).toUpperCase()}${p.substring(1)}s`}
                                            checked={pos.includes(p)}
                                            onChange={e => { e.target.checked ? setPOS([...pos, p]) : setPOS(pos.filter(part => part != p)) }} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormLabel>Principal Parts</FormLabel>
                            <RadioGroup row>
                                {["First", "Second", "Third", "Fourth", "Fifth", "Sixth"].map((p, i) => (
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        key={`pp_${p}`}
                                        label={p}
                                        checked={pps[i]}
                                        disabled={!showEnglish || !pos.includes('verb')}
                                        onChange={e => setPPs(pps.map((v, idx) => i == idx ? e.target.checked : v))} />
                                ))}
                            </RadioGroup>
                            <FormControl>
                                <FormLabel>Accents</FormLabel>
                                <FormControlLabel
                                    control={<Switch />}
                                    disabled={!showEnglish}
                                    style={{ marginTop: '10px', marginBottom: '10px' }}
                                    checked={checkAccents}
                                    label="Check Accents"
                                    onChange={e => setCheckAccents(e.target.checked)} />
                            </FormControl>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={start}>Start</Button>
                    </CardActions>
                </Card>
            )
        }
        else if (complete) {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h5">Quiz Complete!</Typography>
                        <Table size="small" sx={{ padding: '3px' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell><strong>Terms studied</strong></TableCell>
                                    <TableCell>{words.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong># Correct</strong></TableCell>
                                    <TableCell>{attempts - numFailed}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong># Incorrect</strong></TableCell>
                                    <TableCell>{numFailed}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Accuracy</strong></TableCell>
                                    <TableCell>{(attempts - numFailed) / attempts * 100}% </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={restart}>Try Again</Button>
                        <Button variant="outlined" color="secondary" onClick={() => dispatch(go([CHAPTER_LIST, {}]))}>Back to chapter list</Button>
                    </CardActions>
                </Card>
            )
        }
        else if (failed) {
            return (
                <Card>
                    <CardContent>
                        <Stack>
                            <Typography variant="h5">{displayTerm()}</Typography>
                            <Box sx={{ border: '2px solid red', borderRadius: '3.5px', marginTop: '10px' }}>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Your Answer</strong></TableCell>
                                            <TableCell>
                                                {displayAttempt()}
                                                {caseInput != 'NA' ? <em> + {caseInput}</em> : null}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Expected</strong></TableCell>
                                            <TableCell>
                                                {displayAnswer()}
                                                {term.takesCase != 'NA' ? <em> + {term.takesCase}</em> : null}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={reset}>Ok</Button>
                    </CardActions>
                </Card>
            )
        }
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">{displayTerm()}</Typography>
                    {displayInput()}
                    <TextField
                        label="Special case"
                        fullWidth
                        sx={{ marginTop: '15px' }}
                        value={caseInput}
                        onChange={e => setCaseInput(e.target.value)}
                        select size="small"
                    >
                        <MenuItem value={'NA'}>NA</MenuItem>
                        <MenuItem value={'nominative'}>Nominative</MenuItem>
                        <MenuItem value={'genitive'}>Genitive</MenuItem>
                        <MenuItem value={'dative'}>Dative</MenuItem>
                        <MenuItem value={'accusative'}>Accusative</MenuItem>
                        <MenuItem value={'vocative'}>Vocative</MenuItem>
                    </TextField>
                </CardContent>
                <CardActions>
                    <Button variant="outlined" style={{ marginTop: '15px' }} onClick={check}>Check</Button>
                </CardActions>
            </Card>
        )
    }


    const header = () => {
        if (!started) {
            return null
        }
        return (
            <p>
                Term {position + 1} of {words.length}
            </p>
        )
    }

    return (
        <Container>
            <Grid container>
                <Grid item md={10}>
                    <Typography variant="h5" style={{ marginTop: '15px', marginBottom: '15px' }}>Studying {description}</Typography>
                </Grid>
                <Grid item md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="secondary" tabIndex={-1} style={{ float: 'right' }} onClick={() => dispatch(go([CHAPTER_LIST, {}]))}>Back to chapter list</Button>
                </Grid>
                <Grid item md={12}>
                    {header()}
                    {renderTerm()}
                </Grid>
            </Grid>
        </Container>
    )
}

export default VocabQuiz