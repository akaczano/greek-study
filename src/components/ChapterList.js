import { useState } from 'react'
import { Container, ListGroup, Button, Row, Col, ButtonGroup, Modal, Form } from 'react-bootstrap'

function ChapterList(props) {
    const chapters = props.vocab

    const compareChapters = (a, b) => a.description.localeCompare(b.description)

    const [showModal, setShowModal] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [description, setDescription] = useState('')

    const addNew = () => {
        setDescription('')
        setShowModal(true)
    }

    return (
        <Container>
            <Modal size="md" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Chapter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => { setShowModal(false); props.onAdd(description) }}>Save</Button>
                        <Button variant="primary" onClick={() => setShowModal(false)}>Cancel</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
            <Modal size="md" show={toDelete} onHide={() => setToDelete(null)}>
                <Modal.Header closeButton>
                    Confirm delete
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{toDelete}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => { props.onDelete(toDelete); setToDelete(null) }}>Confirm</Button>
                    <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
                </Modal.Footer>
            </Modal>            
            <ListGroup style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {chapters.slice().sort(compareChapters).map(c => {
                    const {
                        attempts,
                        last_studied,
                        words,
                        description
                    } = c

                    const message = last_studied ? `Last studied: ${new Date(last_studied).toLocaleDateString()}` : 'Never studied'

                    return (
                        <ListGroup.Item key={description}>
                            <Row>
                                <Col md={8}>
                                    <strong style={{ fontSize: '18px' }}>{description}</strong> ({words.length} terms)
                                    <p>
                                        {attempts} attempts, {message}
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <ButtonGroup style={{ float: 'right' }}>
                                        <Button variant="primary" onClick={() => props.onEdit(description)}>
                                            { props.readonly ? "View" : "Edit"}
                                        </Button>
                                        <Button variant="primary" onClick={() => props.onStudy(description)} disabled={words.length < 1}>Study</Button>
                                        <Button variant="danger" disabled={props.readonly} onClick={() => setToDelete(description)}>Delete</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )
                })}

            </ListGroup>

            <Button variant="primary" style={{ marginTop: '15px' }} onClick={addNew} disabled={props.readonly}>
                New Chapter
            </Button>
        </Container>
    )
}

export default ChapterList