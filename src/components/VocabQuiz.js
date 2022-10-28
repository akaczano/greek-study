import { useState, useEffect } from 'react'
import { Container, Card, Button, Badge, ButtonGroup, Form, Row, Col } from 'react-bootstrap'
import Latex from 'react-latex'

import GreekInput from './GreekInput'
import { removeAccents } from '../util/greek'


const parts = ['verb', 'noun', 'adjective', 'other']

function VocabQuiz(props) {

    const description = props.chapter.description
    const [words, setWords] = useState([])    

    // Quiz settings
    const [showEnglish, setShowEnglish] = useState(true)
    const [pos, setPOS] = useState(parts)
    const [checkAccents, setCheckAccents] = useState(true)

    const [position, setPosition] = useState(0)
    const [complete, setComplete] = useState(false)
    const [failed, setFailed] = useState(false)
    const [input, setInput] = useState('')
    const [caseInput, setCaseInput] = useState('NA')
    const [numFailed, setNumFailed] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [started, setStarted] = useState(false)

    const term = words[position]


    const check = () => {
        setAttempts(attempts + 1)
        let correct = false
        if (showEnglish) {
            if (checkAccents) {
                correct = input == term.greek && caseInput == term.takesCase
            }            
            else {                
                correct = removeAccents(input) == removeAccents(term.greek)
            }
        }
        else {
            const correctWords = words[position].english.toLowerCase().replaceAll(';', ',').replaceAll(',', ' ').trim().split(/\s+/)
            const inputWords = input.toLowerCase().replaceAll(';', ',').replaceAll(',', ' ').trim().split(/\s+/)
            correct = caseInput == term.takesCase                        
            for (const cw of correctWords) {
                if (!inputWords.includes(cw)) {                    
                    correct = false
                    break
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
                props.onComplete(description)
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
        setWords(props.chapter.words
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
            return <Latex>{`$${words[position].greek}$`}</Latex>
        }
    }

    const displayInput = () => {
        if (showEnglish) {
            return <GreekInput value={input} onChange={setInput} />
        }
        else {
            return <Form.Control value={input} onChange={e => setInput(e.target.value)} />
        }
    }

    const displayAttempt = () => {
        if (showEnglish) {
            return <Latex >{`$${input}$`}</Latex>
        }
        else {
            return <span>{input}</span>
        }
    }

    const displayAnswer = () => {
        if (showEnglish) {
            return <Latex >{`$${term.greek}$`}</Latex>
        }
        else {
            return (<span>{term.english}</span>)
        }
    }
    


    const renderTerm = () => {

        if (!started) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>Quiz of {description}</Card.Title>
                        <p>{props.chapter.words.length} terms</p>
                        <Form>
                            <Form.Group>
                                <Form.Label>Quiz mode</Form.Label> <br />
                                <Form.Check 
                                    inline
                                    label="English to greek"
                                    type="radio"
                                    checked={showEnglish}
                                    onChange={e => setShowEnglish(e.target.checked)} />
                                <Form.Check
                                    inline
                                    label="Greek to english"
                                    type="radio"
                                    checked={!showEnglish}
                                    onChange={e => setShowEnglish(!e.target.checked)} />
                            </Form.Group>
                            <hr />
                            <Form.Group>
                                <Form.Label>Parts of speech</Form.Label> <br />
                                {parts.map(p => (
                                    <Form.Check 
                                        inline 
                                        key={`check_${p}`}
                                        label={`${p.charAt(0).toUpperCase()}${p.substring(1)}s`}
                                        checked={pos.includes(p)}
                                        onChange={e => {e.target.checked ? setPOS([...pos, p]) : setPOS(pos.filter(part => part != p))}}/>
                                ))}
                            </Form.Group>
                            <hr />
                            <Form.Group>
                                <Form.Check
                                    type="switch"
                                    disabled={!showEnglish}
                                    style={{marginTop: '10px', marginBottom: '10px'}}
                                    checked={checkAccents}
                                    label="Check Accents"
                                    onChange={e => setCheckAccents(e.target.checked)}/>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={start}>Start</Button>
                    </Card.Body>
                </Card>
            )
        }
        else if (complete) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>Quiz Complete!</Card.Title>
                        <strong>Terms studied:</strong> {words.length} <br />
                        <strong># Correct:</strong> {attempts - numFailed} <br />
                        <strong># Incorrect:</strong> {numFailed} <br />
                        <strong>Accuracy:</strong> {(attempts - numFailed) / attempts * 100}% <br />
                        <ButtonGroup style={{ marginTop: '15px' }}>
                            <Button variant="success" onClick={restart}>Try Again</Button>
                            <Button variant="success" onClick={props.goBack}>Back to chapter list</Button>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            )
        }
        else if (failed) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>{displayTerm()}</Card.Title>
                        <Badge bg="danger">Incorrect</Badge> <br /><br />
                        <span style={{ marginRight: '7px' }}>You entered: </span>
                        {displayAttempt()}
                        {caseInput != 'NA' ? <em> + {caseInput}</em> : null}
                        <br />
                        <span style={{ marginRight: '7px' }}>Correct was: </span>
                        {displayAnswer()}
                        {term.takesCase != 'NA' ? <em> + {term.takesCase}</em> : null}
                        <br /><br />
                        <Button variant="primary" onClick={reset}>Ok</Button>
                    </Card.Body>
                </Card>
            )
        }
        return (
            <Card>
                <Card.Body>
                    <Card.Title>{displayTerm()}</Card.Title>
                    {displayInput()}
                    <select style={{ marginTop: '8px' }} className="form-control" value={caseInput} onChange={e => setCaseInput(e.target.value)}>
                        <option value={'NA'}>NA</option>
                        <option value={'nominative'}>Nominative</option>
                        <option value={'genitive'}>Genitive</option>
                        <option value={'dative'}>Dative</option>
                        <option value={'accusative'}>Accusative</option>
                        <option value={'vocative'}>Vocative</option>
                    </select>
                    <Button variant="primary" style={{ marginTop: '15px' }} onClick={check}>Check</Button>
                </Card.Body>
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
            <Row>
                <Col md={8}>
                    <h4 style={{ marginTop: '15px', marginBottom: '15px' }}>Studying {description}</h4>
                </Col>
                <Col md={4}>
                    <Button variant="link" tabIndex={-1} style={{ float: 'right' }} onClick={props.goBack}>Back to chapter list</Button>
                </Col>
            </Row>
            <Row>
                {header()}
                {renderTerm()}
            </Row>
        </Container>
    )
}

export default VocabQuiz