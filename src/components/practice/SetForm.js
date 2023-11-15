import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Stack, Row, Col, Spinner, ButtonGroup } from 'react-bootstrap'
import { POS } from '../../util/util'
import { createSet, setInfo } from '../../state/practiceSlice'
import { loadGroups } from '../../state/groupSlice'

function SetForm() {

    const dispatch = useDispatch()
    const info = useSelector(s => s.practice.setInfo)
    const groupList = useSelector(s => s.group.list)
    const groupLoading = useSelector(s => s.group.loading)

    useEffect(() => {
        dispatch(loadGroups())
    }, [dispatch])
    

    return (
        <Stack>
            <span style={{ fontSize: '25x' }}>Select terms</span>
            <Form className="set-form" style={{ marginTop: '15px' }}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Group {groupLoading ? <Spinner variant="border" size="sm" /> : null}</Form.Label>
                            <Form.Select value={info.group} onChange={e => dispatch(setInfo({ ...info, group: e.target.value }))}>
                                <option value={-1}>All</option>
                                {groupList?.map(g => {
                                    return (
                                        <option key={`input_group_${g.id}`} value={g.id}>{g.description}</option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Part of speech</Form.Label>
                            <Form.Select value={info.pos} onChange={e => dispatch(setInfo({ ...info, pos: e.target.value }))}>
                                <option value={-1}>All</option>
                                {POS.map((pos, i) => {
                                    return (
                                        <option key={`input_pos_${pos}`} value={i}>{pos}</option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Limit</Form.Label>
                            <Form.Switch label="Enabled" checked={info.limit !== -1} onChange={e => dispatch(setInfo({ ...info, limit: e.target.checked ? 50 : -1 }))} />
                        </Form.Group>

                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Limit</Form.Label>
                            <Form.Control
                                type="number"
                                value={info.limit}
                                disabled={info.limit === -1}
                                onChange={e => dispatch(setInfo({ ...info, limit: e.target.value }))}
                                min={1} />
                        </Form.Group>

                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select by</Form.Label>
                            <Form.Select disabled={info.limit === -1} value={info.sort} onChange={e => dispatch(setInfo({ ...info, sort: parseInt(e.target.value) }))}>
                                <option value={0}>Random</option>
                                <option value={1}>Lexical order</option>
                                <option value={2}>Study frequency</option>
                                <option value={3}>Last review date</option>
                                <option value={4}>Total accuracy</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>In order</Form.Label>
                            <Form.Select disabled={info.limit === -1} value={info.ordering} onChange={e => dispatch(setInfo({ ...info, ordering: parseInt(e.target.value) }))}>
                                <option value={0}>Ascending</option>
                                <option value={1}>Descending</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Study mode</Form.Label>
                            <Form.Select value={info.mode} onChange={e => dispatch(setInfo({ ...info, mode: parseInt(e.target.value) }))}>
                                <option value={0}>Greek to English</option>
                                <option value={1}>English to Greek</option>
                                <option value={2}>Principal parts</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Check label="check accents" disabled={info.mode === 0} />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Check label="full lexical information" disabled={info.mode !== 1} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <hr />
                </Row>
            </Form>

            <ButtonGroup>
                <Button variant="primary" onClick={() => dispatch(createSet())}>Begin</Button>
                <Button variant="primary" onClick={() => dispatch(setInfo(null))}>Cancel</Button>
            </ButtonGroup>

        </Stack>

    )


}

export default SetForm