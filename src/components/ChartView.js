
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
    TableContainer,
    IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CloseIcon from '@mui/icons-material/Close';

import { removeAccents } from '../util/greek'
import { updateMiscChart } from '../state/contentSlice'
import { CHARTS, go, NOUNS } from '../state/navSlice'
import { updateText } from '../util/input'
import { Stack } from '@mui/system'




function ChartView(props) {
    const dispatch = useDispatch()
    const { chartName } = useSelector(state => state.nav.params)
    
    const initialChart = useSelector(state => state.content.content.charts.filter(c => c.description == chartName)[0])
    
    const [rowLabels, setRowLabels] = useState(initialChart.rowLabels)
    const [columnLabels, setColumnLabels] = useState(initialChart.columnLabels)
    const readOnly = useSelector(state => state.content.readOnly)

    const [chart, setChart] = useState((props.study || !initialChart.chart) ? initialChart.chart.map(r => r.map(e => "")) : initialChart.chart)
    const [dirty, setDirty] = useState(false)
    const [invalid, setInvalid] = useState([])
    const [correct, setCorrect] = useState(false)
    const [label, setLabel] = useState('')

    const addColumn = () => {
        setColumnLabels([...columnLabels, label])
        setChart(chart.slice().map(r => [...r, ""]))
        setLabel('')
        setDirty(true)
    }

    const delColumn = i => {
        setColumnLabels(columnLabels.filter((_, j) => j != i))
        setChart(chart.slice().map(r => r.filter((_, j) => j != i)))
        setDirty(true)
    }

    const addRow = () => {
        setRowLabels([...rowLabels, label])
        setChart([...chart, columnLabels.map(_ => "")])
        setLabel('')
        setDirty(true)
    }

    const delRow = i => {
        setRowLabels(rowLabels.filter((_, j) => j != i))
        setChart(chart.slice().filter((r, j) => j != i))
        setDirty(true)
    }

    const modifyChart = (i, j, v) => {
        const chartCopy = chart.slice()
        const rowCopy = chart[i].slice()
        rowCopy[j] = v
        chartCopy[i] = rowCopy                
        setChart(chartCopy)
        setDirty(true)
    }

    const save = () => {
        dispatch(updateMiscChart({ ...initialChart, rowLabels, columnLabels, chart }))
        setDirty(false)
    }

    const valid = () => true

    const check = () => {
        const l = []

        for (let j = 0; j < chart.length; j++) {
            const row = chart[j];
            for (let i = 0; i < row.length; i++) {
                if (removeAccents(row[i]) != removeAccents(initialChart.chart[j][i])) {
                    console.log(row[i], initialChart.chart[j][i])
                    l.push(j * columnLabels.length + i)
                }
            }
        }
        setInvalid(l)        
        if (l.length < 1) {
            setCorrect(true)
        }
    }

    const reset = () => {
        setChart(initialChart.chart.map(r => r.map(e => "")))
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
                        <Button variant="outlined" disabled={!valid() || correct} onClick={check} tabIndex={rowLabels.length * columnLabels.length}>Check</Button>
                        <Button variant="outlined" onClick={() => dispatch(go([CHARTS, {}]))} tabIndex={rowLabels.length * columnLabels.length + 1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
        else {
            return (
                <div>

                    <Stack direction="row">
                        <TextField size="small" value={label} onChange={e => setLabel(e.target.value)} inputProps={{tabIndex: -1}}/>
                        <IconButton onClick={addRow} tabIndex={-1}>
                            <AddIcon />
                            <TableRowsIcon />
                        </IconButton>
                        <IconButton onClick={addColumn} tabIndex={-1}>
                            <AddIcon />
                            <ViewColumnIcon />
                        </IconButton>
                    </Stack>
                    <hr />

                    <ButtonGroup style={{ marginTop: '15px' }}>
                        <Button variant="outlined" disabled={!dirty || !valid()} onClick={save} tabIndex={rowLabels.length * columnLabels.length + 2}>
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => dispatch(go([CHARTS, {}]))} tabIndex={-1}>Back to chart list</Button>
                    </ButtonGroup>
                </div>
            )
        }
    }

    return (
        <Container>
            <Typography variant="h5" component="h5">{initialChart.description}</Typography>
            <TableContainer component={Paper} sx={{ marginTop: '10px', marginBottom: '25px' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {columnLabels.map((l, i) => {
                                return (
                                    <TableCell>
                                        {l}
                                        {props.study ? null :<IconButton size="small" onClick={() => delColumn(i)} disabled={readOnly} tabIndex={-1}><CloseIcon sx={{fontSize: "12px" }} tabIndex={-1}/></IconButton> }
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {chart.map((r, i) => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        {rowLabels[i]}
                                        { props.study ? null : <IconButton size="small" onClick={() => delRow(i)} disabled={readOnly} tabIndex={-1}> <CloseIcon sx={{fontSize: "12px"}} tabIndex={-1}/> </IconButton>}
                                    </TableCell>
                                    {r.map((ele, j) => {
                                        return (
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    inputProps={{ style: { fontFamily: "tahoma", fontSize: "19px" }, tabIndex: i * r.length + j }}
                                                    value={ele}
                                                    onChange={e => modifyChart(i, j, updateText(e))}
                                                    error={invalid.includes(i * columnLabels.length + j)}
                                                    disabled={readOnly && !props.study} />
                                            </TableCell>
                                        )
                                    })}
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

export default ChartView;