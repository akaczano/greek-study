import { useState } from 'react'
import { Container, ListGroup, Button, ButtonGroup, Row, Col, Modal } from 'react-bootstrap'

import { compareTypes, compareGreek } from '../util/greek'
import TermDisplay from './TermDisplay'
import TermInput from './TermInput'

const blankTerm = {
    greek: '',
    english: '',
    takesCase: 'NA',
    type: 'verb'
}

function ChapterView(props) {
    const {
        description,
        words
    } = props.chapter

    const [showDialog, setShowDialog] = useState(false)

    const [term, setTerm] = useState(blankTerm)

    const doAdd = () => {
        props.addTerm(description, term)
        setShowDialog(false)
    }

    const onEdit = t => {
        setTerm({ ...t, initialGreek: t.greek })
        setShowDialog(true)
    }

    const onNew = () => {
        setTerm(blankTerm)
        setShowDialog(true)
    }



    const compareTerms = (a, b) => {
        if (compareTypes(a.type, b.type) != 0) return compareTypes(a.type, b.type)
        return compareGreek(a.greek, b.greek)
    }


    return (
        <Container>
            <TermInput onClose={() => setShowDialog(false)} add={doAdd} show={showDialog} term={term} setTerm={setTerm} />            
            <ListGroup style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {words.slice().sort(compareTerms).map(t => {
                    return (
                        <ListGroup.Item key={t.greek}>
                            <Row>
                                <Col md={8}>
                                    <TermDisplay term={t} />
                                </Col>
                                <Col md={4}>
                                    <Button variant="danger" style={{ float: 'right' }} onClick={() => props.deleteTerm(description, t.greek)} disabled={props.readonly}>
                                        Delete
                                    </Button>
                                    <Button variant="primary" style={{ marginRight: '10px', float: 'right' }} onClick={() => onEdit(t)} disabled={props.readonly}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
            <ButtonGroup style={{ marginTop: '15px' }}>
                <Button variant="primary" onClick={onNew} disabled={props.readonly}>Add term</Button>
                <Button variant="primary" onClick={() => props.goBack()}>Back to chapter list</Button>
            </ButtonGroup>
        </Container>
    )

}

export default ChapterView