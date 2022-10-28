import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

import GreekInput from './GreekInput'

function TermInput(props) {

    const term = props.term

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                Add Term
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Term</Form.Label>
                        <GreekInput value={term.greek} onChange={nv => props.setTerm({...term, greek: nv})}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Definition</Form.Label>
                        <Form.Control type="text" value={term.english} onChange={e => props.setTerm({...term, english: e.target.value})}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Part of speech</Form.Label>
                        <select className="form-control" value={term.type} onChange={e => props.setTerm({...term, type: e.target.value})}>
                            <option value={'verb'}>Verb</option>
                            <option value={'noun'}>Noun</option>
                            <option value={'adjective'}>Adjective</option>
                            <option value={'other'}>Other</option>
                        </select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Special case</Form.Label>
                        <select className="form-control" value={term.takesCase} onChange={e => props.setTerm({...term, takesCase: e.target.value})}>
                            <option value={'NA'}>NA</option>
                            <option value='nominative'>Nominative</option>
                            <option value='genitive'>Genitive</option>
                            <option value='dative'>Dative</option>
                            <option value='accusative'>Accusative</option>
                            <option value='vocative'>Vocative</option>

                        </select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.add}>Save</Button>
                <Button variant="primary" onClick={props.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default TermInput