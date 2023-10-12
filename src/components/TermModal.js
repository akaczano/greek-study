import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addTerm, setNewTerm, updateTerm } from '../state/termSlice'
import Multiselect from 'multiselect-react-dropdown'

import { POS, cases } from '../util/util'
import { updateText } from '../util/input'

function TermModal() {

    const dispatch = useDispatch()
    const { newTerm, posting } = useSelector(s => s.term)
    const groupList = useSelector(s => s.group.list)



    if (!newTerm) return null

    const title = newTerm?.id ? 'Update term' : 'Add term'

    const greekIn = (e, f) => {
        if (!e.nativeEvent.data) {
            f(e.target.value)
        }
        else {
            updateText(e, f)
        }
    }

    const handler = newTerm.id ? () => dispatch(updateTerm()) : () => dispatch(addTerm())

    const updateGroups = l => {
        dispatch(setNewTerm({ ...newTerm, groups: l.map(g => g.id)}))
    }

    return (
        <Modal show={newTerm} onHide={() => dispatch(setNewTerm(null))} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="term-modal">
                    <Row>
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label>Term</Form.Label>
                                <Form.Control type="text" value={newTerm.term} onChange={e => greekIn(e, str => dispatch(setNewTerm({ ...newTerm, term: str })))} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Special case</Form.Label>
                                <Form.Select value={newTerm.case} onChange={e => dispatch(setNewTerm({ ...newTerm, case: e.target.value }))}>
                                    {cases.map((c, i) => <option key={`case_${i}`} value={i}>{c}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Definition</Form.Label>
                                <Form.Control type="text" value={newTerm.definition} onChange={e => dispatch(setNewTerm({ ...newTerm, definition: e.target.value }))} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Part of speech</Form.Label>
                                <Form.Select value={newTerm.pos} onChange={e => dispatch(setNewTerm({ ...newTerm, pos: e.target.value }))}>
                                    {POS.map((p, v) => <option key={`pos_${v}`} value={v}>{p}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Groups</Form.Label>
                                <Multiselect
                                    className="form-control"
                                    isObject={true}
                                    displayValue="description"
                                    options={groupList}
                                    showCheckbox={true}
                                    selectedValues={groupList.filter(g => newTerm.groups.includes(g.id))}
                                    onRemove={e => updateGroups(e)}
                                    onSelect={e => updateGroups(e)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>Principal parts</Col>
                    </Row>
                    <Row>
                        {newTerm.pps.map((pp, i) => (
                            <Col key={`pp_${i}`}>
                                <Form.Control
                                    type="text"
                                    value={pp}
                                    onChange={e => greekIn(e, str => dispatch(setNewTerm({ ...newTerm, pps: [...newTerm.pps.slice(0, i), str, ...newTerm.pps.slice(i + 1)]})))} />
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" rows={8} value={newTerm.notes} onChange={e => dispatch(setNewTerm({ ...newTerm, notes: e.target.value }))} />
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handler} disabled={posting}>Save</Button>
                <Button variant="primary" onClick={() => dispatch(setNewTerm(null))} disabled={posting}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default TermModal