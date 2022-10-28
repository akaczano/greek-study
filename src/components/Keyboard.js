import { useState } from 'react'
import { Table, Form, Button, Row, Col, Container, ButtonGroup } from 'react-bootstrap'

import { defaultKeys, defaultCommands, lowerCaseLetters } from '../util/greek'
import GreekInput from './GreekInput'

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
                <Row key={i} style={{ margin: '5px' }}>
                    <Col><GreekInput disabled={true} value={lowerCaseLetters[i]} /></Col>
                    <Col><Form.Control type="text" value={keys[i]} onChange={e => updateKeys(i, e.target.value)} /></Col>
                </Row>
            )
        }
        else {
            return (
                <Row key={i} style={{ margin: '5px' }}>
                    <Col>{labels[i]}</Col>
                    <Col><Form.Control type="text" value={commands[i]} onChange={e => updateKeys(i, e.target.value)} /></Col>
                </Row>
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
        <div>

            { getInstructions()}
            <Row>
                <ButtonGroup>
                    <Button variant="secondary" disabled={tabIndex == 0} onClick={() => setTabIndex(0)}>Letters</Button>
                    <Button variant="secondary" disabled={tabIndex != 0} onClick={() => setTabIndex(1)}>Symbols</Button>
                </ButtonGroup>
            </Row>
            <Container >
                <Row>
                    <Col style={{ textAlign: 'center' }}>{tabIndex == 0 ? "Greek letter" : "Symbol"}</Col>
                    <Col style={{ textAlign: 'center' }}>Bound key</Col>
                </Row>
                <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    {tabIndex == 0 ? keys.map((_, i) => getRow(i)) : commands.map((_, i) => getRow(i))}
                </div>
            </Container>

            <br />
            <Button variant="primary" disabled={!dirty || invalid()} onClick={save}>Save</Button>
        </div>
    )

}


export default Keyboard
