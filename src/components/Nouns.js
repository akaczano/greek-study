import { useState } from 'react'
import { ListGroup, Button, ButtonGroup, Card, Modal, Form, Row, Col } from 'react-bootstrap'

function Nouns(props) {

    const [description, setDescription] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const [settings, setSettings] = useState({
        mode: 0,
        filter: 'all',
        articles: false
    })

    const add = () => {
        props.onAdd({ description, pattern: '', chart: null })
        setDescription(null)
    }

    const deleteChart = () => {
        props.delete(deleting)
        setDeleting(null)
    }

    return (
        <div>
            <Modal show={description != null} onHide={() => setDescription(null)}>
                <Modal.Header closeButton>
                    Create new chart
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
                        <Button variant="primary" onClick={add}>Add</Button>
                        <Button variant="primary" onClick={() => setDescription(null)}>Cancel</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
            <Modal show={deleting} onHide={() => setDeleting(null)}>
                <Modal.Header closeButton>
                    Confirm deletion
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to delete chart {deleting}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup>
                        <Button variant="danger" onClick={deleteChart}>Confirm</Button>
                        <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>            
            <ListGroup style={{ maxHeight: '35vh', overflowY: 'auto' }}>
                {props.charts?.sort((a, b) => a.description.localeCompare(b.description)).map(c => {
                    return (
                        <ListGroup.Item key={c.description}>
                            <span style={{ fontSize: '16px' }}>{c.description}</span>
                            <ButtonGroup style={{ float: 'right' }}>
                                <Button variant="primary" onClick={() => props.onSelect(c.description)}>
                                    { props.readonly ? "View" : "Edit" }
                                </Button>
                                <Button variant="primary" disabled={!c.chart} onClick={() => props.onStudy(c.description)}>Study</Button>
                                <Button variant="danger" onClick={() => setDeleting(c.description)} disabled={props.readonly}>Delete</Button>
                            </ButtonGroup>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
            <Button style={{ marginTop: '15px' }} onClick={() => setDescription('')}>Add chart</Button>
            <hr />
            <Card>
                <Card.Header><strong>Practice</strong></Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Mode</Form.Label> <br />
                            <Form.Check
                                inline
                                checked={settings.mode == 0}
                                label="Greek -> English, case"
                                type="radio"
                                onChange={e => setSettings({ ...settings, mode: e.target.checked ? 0 : 1 })}
                            />
                            <Form.Check
                                inline
                                checked={settings.mode == 1}
                                label="English, case -> Greek"
                                type="radio"
                                onChange={e => setSettings({ ...settings, mode: e.target.checked ? 1 : 0 })}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Use chart</Form.Label>
                                    <select className="form-control" value={settings.filter} onChange={e => setSettings({ ...settings, filter: e.target.value })}>
                                        <option value='all'>All charts</option>
                                        {props.charts.map(c => {
                                            const { description } = c
                                            return (
                                                <option key={description + '_selectkey'} value={description}>{description}</option>
                                            )
                                        })}
                                    </select>
                                </Form.Group> <br />
                            </Col>
                            <Col>
                                <Form.Group>   
                                    <Form.Label>Article Setting</Form.Label>                                                                     
                                    <Form.Check
                                        type="switch"
                                        label="Include article"
                                        onChange={e => setSettings({...settings, articles: e.target.checked})}
                                        value={settings.articles}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={() => props.onQuiz(settings)}>Start</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Nouns