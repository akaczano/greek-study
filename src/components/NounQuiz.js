import { useState, useEffect } from 'react'
import { removeAccents } from '../util/greek'
import { Row, Col, Card, Button, Form, ButtonGroup } from 'react-bootstrap'

import GreekInput from './GreekInput'

const getCase = i => ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'][i % 5]

const getNumber = i => i < 5 ? 'Singular' : 'Plural'

function NounQuiz(props) {
    const {
        vocab,
        charts,
        settings
    } = props
    
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
            return <strong style={{fontFamily: 'Tahoma'}}>{term?.greek}</strong>
        }
        else if (settings.mode == 1) {
            return (<>
                <span>{term?.english}</span>
                <em style={{ fontSize: '15px', marginLeft: '5px', color: 'gray' }}>in the {getCase(term.caseIndex)} {getNumber(term.caseIndex)}</em>
            </>)
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
                    <Row>
                        <Col>
                            {term.english}
                        </Col>
                        <Col>
                            {getCase(term.caseIndex % 5)}
                        </Col>
                        <Col>
                            {getNumber(term.caseIndex)}
                        </Col>
                    </Row>
                )
            }
            return (
                <Row>
                    <Col>
                        <Form.Control type="text" value={textInput} onChange={e => setTextInput(e.target.value)} />
                    </Col>
                    <Col>
                        <select className="form-control" value={caseInput} onChange={e => setCaseInput(parseInt(e.target.value))}>
                            <option value={0}>Nominative</option>
                            <option value={1}>Genitive</option>
                            <option value={2}>Dative</option>
                            <option value={3}>Accusative</option>
                            <option value={4}>Vocative</option>
                        </select>
                    </Col>
                    <Col>
                        <select className="form-control" value={numberInput} onChange={e => setNumberInput(parseInt(e.target.value))}>
                            <option value={0}>Singular</option>
                            <option value={1}>Plural</option>
                        </select>
                    </Col>
                </Row>
            )
        }
        else if (settings.mode == 1) {
            if (show) {
                return term.greek
            }
            return <GreekInput value={textInput} onChange={t => setTextInput(t)} />
        }
    }
    
    return (

        <>
            <Row>
                <h5>Noun practice</h5>
                <Card>
                    <Card.Body>
                        <Card.Title>{displayPrompt()}</Card.Title> <br />
                        {displayInput()}
                        <br /> {wrong ? (<p style={{ color: 'red' }}>Incorrect</p>) : null}
                        <ButtonGroup>
                            <Button variant="primary" onClick={check}>{show ? 'Next' : 'Check'}</Button>
                            <Button variant="primary" onClick={() =>    setShow(true)}>Show Answer</Button>
                            <Button variant="secondary" onClick={props.back}>Back to chart list</Button>
                        </ButtonGroup>

                    </Card.Body>
                </Card>
            </Row>
        </>

    )
}

export default NounQuiz