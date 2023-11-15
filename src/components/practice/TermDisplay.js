import { useState } from "react"
import { Button, Card, Form, Spinner, Stack, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { cancelSet } from "../../state/practiceSlice";
import { updateText } from '../../util/input'
import { checkEnglish, checkGreek } from "../../util/grader";

const FIRST_ATTEMPT = 0
const CORRECT = 1
const FAILED = 2
const RETRY = 3

function TermDisplay() {

    const dispatch = useDispatch()
    const {
        currentTerm,
        currentSet,
        canceling
    } = useSelector(s => s.practice)

    const [input, setInput] = useState('')
    const [ppInput, setPPInput] = useState('')
    const [status, setStatus] = useState(FIRST_ATTEMPT)
    let mode = currentSet.set.mode

    const grade = () => {
        if (mode === 0) {
            return checkEnglish(currentTerm.term.definition, input)
        }
        else if (mode === 0) {
            return checkGreek(currentTerm.term.term, input, currentSet.set.check_accents, currentSet.set.full_lexical)
        }
        else {
            let result = true
            for (let i = 0; i < 6; i++) {
                const expected = currentTerm.term.pps[i]
                result = result && checkGreek(expected, ppInput[i], currentSet.set.check_accents, true) 
            }
        }
    }


    const updateInput = e => {
        if (!e.nativeEvent.data || mode === 0) {
            setInput(e.target.value)
        }
        else {
            updateText(e, setInput)
        }
    }

    const getPrompt = () => {        
        if (mode === 0) {
            return currentTerm.term.term
        }
        else if (mode === 1) {
            return currentTerm.term.definition
        }
        else {
            return `Principal parts of ${currentTerm.term.term}`
        }
    }

    const getInput = () => {        
        if (mode === 0 || mode === 1) {
            return (
                <Form.Control                    
                    style={{ fontSize: '25px', marginBottom: '20px' }}
                    value={input} 
                    onChange={updateInput} />
            )
        }
        else {
            return (
                <Row style={{ marginBottom: '25px' }}>
                    {currentTerm.term.pps.map((_, i) => {
                        return (
                            <Col>
                                <Form.Control key={`ppin_${i}`} type="text" />
                            </Col>
                        )                        
                    })}
                </Row>
            )
        }
    }


    const getBody = () => {
        if (currentTerm.loading || currentTerm.posting || !currentTerm.term) {
            return <Spinner />
        }
        return (
            <>
                <Card.Title style={{ marginBottom: '20px', fontSize: '40px' }}>
                    {getPrompt()}
                </Card.Title>
                {getInput()}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="primary">Submit</Button>
                    <Button variant="danger">Give up </Button>
                </Stack>
            </>
        )
    }

    return (
        <Stack gap={1}>
            <Card>
                <Card.Header>
                    <Card.Title>Practicing (? / ?)</Card.Title>
                    <Card.Body>
                        {getBody()}
                    </Card.Body>
                </Card.Header>
            </Card>
            <div>
                <Stack direction="horizontal" style={{ maxWidth: '50%', float: "right"}}>
                    <Form.Switch label="Auto-next" />
                    <Button variant="link" onClick={() => dispatch(cancelSet())} disabled={canceling}>
                        { canceling ? <Spinner size="sm" /> : "Cancel set" }
                    </Button>
                </Stack>
            </div>

        </Stack>
    )

}

export default TermDisplay