import { useState } from 'react'
import { Table, Button, ButtonGroup, Badge } from 'react-bootstrap'

import { removeAccents } from '../util/greek'
import GreekInput from './GreekInput'

const cases = [
    'Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'
]

function ChartDisplay(props) {

    const [pattern, setPattern] = useState(props.chart.pattern || '')
    const [chart, setChart] = useState((props.study || !props.chart.chart) ? ['', '', '', '', '', '', '', '', '', ''] : props.chart.chart)
    const [dirty, setDirty] = useState(false)
    const [invalid, setInvalid] = useState([])
    const [correct, setCorrect] = useState(false)

    const updateChart = (i, v) => {
        const chartCopy = chart.slice()
        chartCopy[i] = v
        setChart(chartCopy)
        setDirty(true)
    }

    const save = () => {
        props.onUpdate({ ...props.chart, pattern, chart })
        setDirty(false)
    }

    const valid = () => !chart.some(c => c.length < 1) && pattern.length > 0

    const check = () => {
        const l = []
        for (let i = 0; i < chart.length; i++) {
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
        setChart(['', '', '', '', '', '', '', '', '', ''])
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
                <div>
                    Match nouns that end with<br /><br />
                    <GreekInput value={pattern} onChange={v => { setPattern(v); setDirty(true) }} tabIndex={cases.length * 2}/> <br />
                    <ButtonGroup style={{ marginTop: '15px' }}>
                        <Button variant="primary" disabled={!dirty || !valid()} onClick={save} tabIndex={cases.length * 2 + 1}>
                            Save
                        </Button>
                        <Button variant="primary" onClick={props.back} tabIndex={-1}>Back to chart list</Button>
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
                                <td><GreekInput value={chart[i]} onChange={v => updateChart(i, v)} tabIndex={i} invalid={invalid.includes(i)} /></td>
                                <td><GreekInput value={chart[pi]} onChange={v => updateChart(pi, v)} tabIndex={pi} invalid={invalid.includes(pi)} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {getBottom()}

        </div>
    )

}

export default ChartDisplay