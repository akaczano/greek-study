import { useState } from 'react'
import {
    TextField,
    Container,
    MenuItem,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    Grid,
    Checkbox,
    Button,
    ButtonGroup,
    Chip,
    Typography,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { updateVerbChart } from '../state/contentSlice'
import { go, VERBS } from '../state/navSlice'
import { removeAccents } from '../util/greek'
import { updateText } from '../util/input'

const cases = [
    'First Person', 'Second Person', 'Third Person'
]

const numbers = ['Singular', 'Plural']

function VerbDisplay(props) {
    const dispatch = useDispatch()
    const { chartName } = useSelector(state => state.nav.params)
    const initialChart = useSelector(state => state.content.content.verbs.filter(c => c.description == chartName)[0])
    const readOnly = useSelector(state => state.content.readOnly)

    const [chart, setChart] = useState((props.study || !initialChart.chart) ? ['', '', '', '', '', ' '] : initialChart.chart)
    const [dirty, setDirty] = useState(false)
    const [invalid, setInvalid] = useState([])
    const [correct, setCorrect] = useState(false)

    const [ms, setMS] = useState(initialChart?.medialSigma == null ? false : initialChart.medialSigma)
    const [augment, setAugment] = useState(initialChart.augment || '')
    const [pp, setPP] = useState(initialChart.principalPart || 1)
    const [irregular, setIrregular] = useState(initialChart.irregular || false)



    const updateChart = (i, v) => {
        const chartCopy = chart.slice()
        chartCopy[i] = v
        setChart(chartCopy)
        setDirty(true)
    }

    const save = () => {
        dispatch(updateVerbChart({ ...initialChart, chart, medialSigma: ms, augment, irregular, principalPart: pp }))
        setDirty(false)
    }

    const valid = () => !chart.some(c => c.length < 1)

    const check = () => {
        const l = []
        for (let i = 0; i < chart.length; i++) {
            console.log(chart[i], initialChart.chart[i])
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
        setChart(['', '', '', '', '', ''])
        setCorrect(false)
    }

    const getBottom = () => {
        if (props.study) {
            return (
                <div>
                    {correct ? (
                        <>
                            <Chip color="success" label="Practice complete" />
                            <Button color="secondary" onClick={reset} tabIndex={cases.length * 2 + 2}>Try again</Button> <br />
                            <hr />
                        </>
                    ) : null}

                    <ButtonGroup>
                        <Button variant="outlined" disabled={!valid() || correct} onClick={check} tabIndex={cases.length * 2}>Check</Button>
                        <Button variant="outlined" onClick={() => dispatch(go([VERBS, {}]))} tabIndex={cases.length * 2 + 1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
        else {
            return (
                <Grid container rowSpacing={2} columnSpacing={3}>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Type</FormLabel>
                            <RadioGroup row>
                                <FormControlLabel
                                    checked={!irregular}
                                    control={<Radio />}
                                    label="Endings"
                                    onChange={e => setIrregular(!e.target.checked)}
                                    tabIndex={7} />
                                <FormControlLabel
                                    checked={irregular}
                                    value={true}
                                    control={<Radio />}
                                    label="Irregular Verb"
                                    tabIndex={8}
                                    onChange={e => setIrregular(e.target.checked)} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Principal Part"
                            type="number"
                            value={pp}
                            disabled={irregular || readOnly}
                            tabIndex={9}
                            onChange={e => { setPP(e.target.value); setDirty(true) }}
                            select
                            fullWidth
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            label="Augment"
                            size="small"
                            value={augment}
                            disabled={irregular || readOnly}
                            onChange={t => { setAugment(t); setDirty(true) }}
                            inputProps={{ tabIndex: 10, style: { fontFamily: "tahoma", fontSize: "19px" } }} />

                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControlLabel
                            disabled={irregular || readOnly}
                            control={<Checkbox checked={ms} onChange={e => { setMS(e.target.checked); setDirty(true) }} />}
                            label="Medial sigma" />
                    </Grid>
                    <Grid item>
                        <ButtonGroup style={{ marginTop: '15px' }}>
                            <Button variant="outlined" disabled={!dirty || !valid()} onClick={save} tabIndex={12} >
                                Save
                            </Button>
                            <Button variant="outlined" onClick={() => dispatch(go([VERBS, {}]))} tabIndex={13}>Back to chart list</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid >
            )
        }
    }

    return (
        <Container>
            <Typography variant="h5" component="h5">{initialChart.description}</Typography>
            <TableContainer component={Paper} sx={{ marginBottom: '15px', marginTop: '10px' }}>
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
                                    <TableCell >
                                        <TextField
                                            size="small"                                            
                                            value={chart[i]}
                                            sx={{ width: "80%" }}
                                            onChange={e => updateChart(i, updateText(e))}
                                            inputProps={{ tabIndex: i, style: { fontFamily: "tahoma", fontSize: "19px" } }}
                                            error={invalid.includes(i)}
                                            disabled={readOnly} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"                                            
                                            value={chart[pi]}
                                            sx={{ width: '80%' }}
                                            onChange={e => updateChart(pi, updateText(e))}
                                            inputProps={{ tabIndex: pi, style: { fontFamily: "tahoma", fontSize: "19px" } }}
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

export default VerbDisplay