import { useState } from 'react'
import { ListGroup, Button, ButtonGroup, Modal, Form, Row, Col } from 'react-bootstrap'

function Verbs(props) {

    const { charts } = props
    const [description, setDescription] = useState(null)    

    return (
        <div>
            <Modal show={description != null} onHide={() => setDescription(null)}>
                <Modal.Header>
                    <Modal.Title>Add verb chart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={e => setDescription(e.target.value)}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => {props.onAdd({description, chart: null}); setDescription(null)}}>Add</Button>
                        <Button variant="primary" onClick={() => setDescription(null)}>Cancel</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
            <h3>Verb Endings</h3>
            <ListGroup>
                {charts.sort((a, b) => a.description.localeCompare(b.description)).map(c => {
                    return (                        
                            <ListGroup.Item key={c.description}>
                                <span style={{ fontSize: '16px' }}>{c.description}</span>
                                <ButtonGroup style={{ float: 'right' }}>
                                    <Button variant="primary" onClick={() => props.onSelect(c.description)}>Edit</Button>
                                    <Button variant="primary" disabled={!c.chart} onClick={() => props.onStudy(c.description)}>Study</Button>
                                    <Button variant="danger" onClick={() => {props.delete(c.description)}}>Delete</Button>
                                </ButtonGroup>
                            </ListGroup.Item>                        
                    )
                })}
            </ListGroup>

            <Button style={{ marginTop: '15px' }} onClick={() => setDescription('')}>Add chart</Button>
        </div>
    )
}

export default Verbs