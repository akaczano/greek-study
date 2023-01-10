import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
    Container,
    TextField,
    Button,
    ButtonGroup,
    Chip,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TableContainer
} from '@mui/material'

import { removeAccents } from '../util/greek'
import { updateChart } from '../state/contentSlice'
import { go, NOUNS } from '../state/navSlice'
import { updateText } from '../util/input'

const cases = [
    'Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'
]

function ChartDisplay(props) {
    const dispatch = useDispatch()
    const { chartName } = useSelector(state => state.nav.params)
    const initialChart = useSelector(state => state.content.content.declensions.filter(c => c.description == chartName)[0])
    const readOnly = useSelector(state => state.content.readOnly)

    const [pattern, setPattern] = useState(initialChart.pattern || '')
    const [chart, setChart] = useState((props.study || !initialChart.chart) ? ['', '', '', '', '', '', '', '', '', ''] : initialChart.chart)
    const [dirty, setDirty] = useState(false)
    const [invalid, setInvalid] = useState([])
    const [correct, setCorrect] = useState(false)

    const modifyChart = (i, v) => {
        const chartCopy = chart.slice()
        chartCopy[i] = v
        setChart(chartCopy)
        setDirty(true)
    }

    const save = () => {
        dispatch(updateChart({ ...initialChart, pattern, chart }))
        setDirty(false)
    }

    const valid = () => !chart.some(c => c.length < 1) && pattern.length > 0

    const check = () => {
        const l = []
        for (let i = 0; i < chart.length; i++) {
            if (removeAccents(chart[i]) != removeAccents(initialChart.chart[i])) {
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
                            <Chip color="success" label="Study complete" />
                            <Button color="secondary" onClick={reset}>Try again</Button> <br />
                            <hr />
                        </>
                    ) : null}

                    <ButtonGroup>
                        <Button variant="outlined" disabled={!valid() || correct} onClick={check} tabIndex={cases.length * 2}>Check</Button>
                        <Button variant="outlined" onClick={() => dispatch(go([NOUNS, {}]))} tabIndex={cases.length * 2 + 1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
        else {
            return (
                <div>
                    <TextField
                        label="Match nouns ending with"
                        disabled={readOnly}
                        value={pattern}
                        onChange={e => { setPattern(updateText(e)); setDirty(true) }}
                        tabIndex={cases.length * 2}
                        size="small"
                        inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" } }} />
                    <br />
                    <ButtonGroup style={{ marginTop: '15px' }}>
                        <Button variant="outlined" disabled={!dirty || !valid()} onClick={save} tabIndex={cases.length * 2 + 1}>
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => dispatch(go([NOUNS, {}]))} tabIndex={-1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
    }

    return (
        <Container>
            <Typography variant="h5" component="h5">{initialChart.description}</Typography>            
            <TableContainer component={Paper} sx={{ marginTop: '10px', marginBottom: '25px'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Singular</TableCell>
                            <TableCell>Plural</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cases.map((c, i) => {
                            const pi = i + cases.length
                            return (
                                <TableRow>
                                    <TableCell>{c}</TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" }, tabIndex: i }}
                                            value={chart[i]}
                                            onChange={e => modifyChart(i, updateText(e))}
                                            error={invalid.includes(i)}
                                            disabled={readOnly} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" }, tabIndex: pi }}
                                            value={chart[pi]}
                                            onChange={e => modifyChart(pi, updateText(e))}
                                            error={invalid.includes(pi)}
                                            disabled={readOnly} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {getBottom()}

        </Container>
    )

}

export default ChartDisplay