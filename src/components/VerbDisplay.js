import { useState } from 'react'
import { Table, Button, ButtonGroup, Badge, Form, Row, Col } from 'react-bootstrap'

import { removeAccents } from '../util/greek'
import GreekInput from './GreekInput'

const cases = [
    'First Person', 'Second Person', 'Third Person'
]

function VerbDisplay(props) {

    const [chart, setChart] = useState((props.study || !props.chart.chart) ? ['', '', '', '', '', ' '] : props.chart.chart)
    const [dirty, setDirty] = useState(false)
    const [invalid, setInvalid] = useState([])
    const [correct, setCorrect] = useState(false)

    const [ms, setMS] = useState(props.chart.medialSigma || false)
    const [augment, setAugment] = useState(props.chart.augment || '')
    const [pp, setPP] = useState(props.chart.principalPart || 1)
    const [irregular, setIrregular] = useState(props.chart.irregular || false) 

    

    const updateChart = (i, v) => {
        const chartCopy = chart.slice()
        chartCopy[i] = v
        setChart(chartCopy)
        setDirty(true)
    }

    const save = () => {
        props.onUpdate({ ...props.chart, chart, medialSigma: ms, augment, irregular, principalPart: pp })
        setDirty(false)
    }

    const valid = () => !chart.some(c => c.length < 1)

    const check = () => {
        const l = []
        for (let i = 0; i < chart.length; i++) {
            console.log(chart[i], props.chart.chart[i])            
            if (removeAccents(chart[i]) != removeAccents(props.chart.chart[i])) {
                l.push(i)
            }
        }
        setInvalid(l)
        if (l.length < 1) {
            setCorrect(true)
        }
    }

    const reset = () => {
        setChart(['', '', '', '', '', ''])
        setCorrect(false)
    }

    const getBottom = () => {
        if (props.study) {
            return (
                <div>
                    {correct ? (
                        <>
                            <Badge bg="success">Study Complete</Badge>
                            <Button variant="link" onClick={reset}>Try again</Button> <br />
                            <hr />
                        </>
                    ) : null}

                    <ButtonGroup>
                        <Button variant="primary" disabled={!valid() || correct} onClick={check} tabIndex={cases.length * 2}>Check</Button>
                        <Button variant="primary" onClick={props.back} tabIndex={cases.length * 2 + 1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
        else {
            return (
                <div style={{ width: '40vw' }}>
                    <Row>
                        <Col>
                            <Form.Check
                                type="radio"
                                label="Endings"
                                checked={!irregular}
                                tabIndex={7}
                                disabled={props.readonly}
                                onChange={e => {setIrregular(!e.target.checked); setDirty(true)}} />
                        </Col>
                        <Col>
                            <Form.Check
                                type="radio"
                                label="Irregular Verb"
                                checked={irregular}
                                tabIndex={8}
                                disabled={props.readonly}
                                onChange={e => {setIrregular(e.target.checked); setDirty(true)}} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Principal Part</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={pp}
                                    disabled={irregular || props.readonly}
                                    tabIndex={9}                                    
                                    onChange={e => {setPP(e.target.value); setDirty(true)}}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Augment</Form.Label>
                                <GreekInput value={augment} disabled={irregular || props.readonly} onChange={t => {setAugment(t); setDirty(true)}} tabIndex={10}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Check
                                label="medial sigma"
                                style={{marginTop: '30px'}}
                                disabled={irregular || props.readonly}
                                tabIndex={11}
                                onChange={e => setMS(e.target.checked)} />
                        </Col>
                    </Row>

                    <ButtonGroup style={{ marginTop: '15px' }}>
                        <Button variant="primary" disabled={!dirty || !valid()} onClick={save} tabIndex={12}>
                            Save
                        </Button>
                        <Button variant="primary" onClick={props.back} tabIndex={13}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
    }

    return (
        <div>
            <h4>{props.chart.description}</h4>
            <hr />
            <Table size="sm">
                <thead>
                    <tr>
                        <th></th>
                        <th>Singular</th>
                        <th>Plural</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((c, i) => {
                        const pi = i + cases.length
                        return (
                            <tr>
                                <td>{c}</td>
                                <td><GreekInput value={chart[i]} onChange={v => updateChart(i, v)} tabIndex={i} invalid={invalid.includes(i)} disabled={props.readonly} /></td>
                                <td><GreekInput value={chart[pi]} onChange={v => updateChart(pi, v)} tabIndex={pi} invalid={invalid.includes(pi)} disabled={props.readonly} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {getBottom()}

        </div>
    )

}

export default VerbDisplay