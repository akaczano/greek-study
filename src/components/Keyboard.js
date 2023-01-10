import { useState } from 'react'

import {
    Button,
    Container,
    Tab,
    Box,
    Tabs,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TextField,
    Paper
} from '@mui/material'

import { defaultKeys, defaultCommands, lowerCaseLetters } from '../util/greek'

function Keyboard() {

    const labels = ["Smooth breathing", "Rough breathing", "Acute", "Grave", "Circumflex", "Iota subscript"]

    const [keys, setKeys] = useState(localStorage.getItem('greek_keys')?.split(',') || defaultKeys)
    const [commands, setCommands] = useState(localStorage.getItem('greek_commands')?.split(',') || defaultCommands)
    const [dirty, setDirty] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)

    const invalid = () => keys.some(k => k.length != 1)

    const updateKeys = (i, v) => {
        if (tabIndex == 0) {
            const copy = keys.slice()
            copy[i] = v
            setKeys(copy)
        }
        else {
            const copy = commands.slice()
            copy[i] = v
            setCommands(copy)
        }
        setDirty(true)
    }


    const save = () => {
        localStorage.setItem('greek_keys', keys)
        localStorage.setItem('greek_commands', commands)
        setDirty(false)
    }

    const getRow = (i) => {
        if (tabIndex == 0) {
            return (
                <TableRow key={i} style={{ margin: '5px' }}>
                    <TableCell>
                        <TextField size="small" disabled={true} value={lowerCaseLetters[i]} inputProps={{ style: { fontFamily: "tahoma" } }} />
                    </TableCell>
                    <TableCell>
                        <TextField size="small" value={keys[i]} onChange={e => updateKeys(i, e.target.value)} />
                    </TableCell>
                </TableRow>
            )
        }
        else {
            return (
                <TableRow key={i} style={{ margin: '5px' }}>
                    <TableCell>{labels[i]}</TableCell>
                    <TableCell><TextField size="small" value={commands[i]} onChange={e => updateKeys(i, e.target.value)} /></TableCell>
                </TableRow>
            )
        }
    }

    const getInstructions = () => {
        if (tabIndex == 0) {
            return <p>Enter the english keys you want to use for each Greek letter. They need to be letters or it won't work.</p>
        }
        else {
            return (
                <p>
                    The below keys will apply their corresponding symbol to the letter immediately to the left of
                    your cursor when pressed.
                </p>
            )
        }
    }

    return (
        <Container>

            {getInstructions()}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={(_, i) => setTabIndex(i)} aria-label="basic tabs example">
                    <Tab label="Letters" />
                    <Tab label="Symbols" />
                </Tabs>
            </Box>
            <TableContainer component={Paper} sx={{maxHeight: "60vh", marginBottom: '15px'}}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{tabIndex == 0 ? "Greek letter" : "Symbol"}</TableCell>
                            <TableCell>Bound Key</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabIndex == 0 ? keys.map((_, i) => getRow(i)) : commands.map((_, i) => getRow(i))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Button variant="outlined" disabled={!dirty || invalid()} onClick={save}>Save</Button>
        </Container>
    )

}


export default Keyboard
