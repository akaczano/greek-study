
import { useEffect, useState } from 'react'
import { ListGroup, Spinner, Stack, Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { loadGroups, setUpdate, addGroup, updateGroup, removeGroup, clearError } from '../../state/groupSlice'
import { setFilter } from '../../state/termSlice'

function GroupList() {

    const dispatch = useDispatch()
    const {
        list, loading, error, update, posting, deleting, loadError
    } = useSelector(s => s.group)

    const { filter } = useSelector(s => s.term)


    useEffect(() => {
        dispatch(loadGroups())
    }, [dispatch])


    const [newDesc, setNewDesc] = useState(null)

    const addModal = () => {
        if (newDesc === null) return null
        return (
            <Modal onHide={() => setNewDesc(null)} show={newDesc !== null}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new term group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Group description</Form.Label>
                        <Form.Control type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { dispatch(addGroup(newDesc)); setNewDesc(null) }}>Add</Button>
                    <Button variant="primary" onClick={() => setNewDesc(null)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const renderGroup = g => {
        const selectGroup = id => {
            if (id === filter.group) {
                dispatch(setFilter({...filter, group: -1}))
            }
            else {
                dispatch(setFilter({...filter, group: id}))
            }
        }

        const cn = g.id === filter.group ? 'group-label selected' : 'group-label'

        const display = g.id === update.id ?
            (
                <Stack direction="horizontal" gap={2}>
                    <Form.Control
                        type="text"
                        value={update.description || ''}
                        onChange={e => dispatch(setUpdate({ ...update, description: e.target.value }))} />
                    <Button size="sm" onClick={() => dispatch(updateGroup())} disabled={posting}>Save</Button>
                    <Button size="sm" onClick={() => dispatch(setUpdate({ id: -1, description: '' }))} disabled={posting}>Cancel</Button>
                </Stack>

            ) :
            (
                <span onDoubleClick={() => dispatch(setUpdate(g))} className={cn} onClick={() => selectGroup(g.id)}>
                    {g.description}
                </span>
            )

        return (
            <ListGroup.Item key={`group_${g.id}`}>

                <Row>
                    <Col md={9}>
                        {display}
                    </Col>
                    <Col md={3}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => dispatch(removeGroup(g.id))}
                            disabled={deleting.includes(g.id)}
                            style={{ float: 'right' }}
                        >
                            Remove
                        </Button>
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    const renderList = () => {
        if (loading) {
            return (
                <div>
                    <strong>Loading groups</strong>
                    <Spinner animation="border" />
                </div>
            )
        }
        else if (loadError) {
            return (
                <div>
                    <p style={{ color: 'red' }}>{error.message}</p>
                    <Button variant="link" onClick={() => dispatch(loadGroups())}>Reload</Button>
                </div>
            )
        }
        else if (list.length < 1) {
            return (
                <div style={{ padding: '20px'}}>
                    <p>You don't have any groups yet.</p>
                </div>
            )
        }
        else {
            return (
                <ListGroup>
                    {list.map(renderGroup)}
                </ListGroup>
            )
        }
    }

    const errorMessage = () => {
        if (!error) return null
        return (
            <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
                {error.message}
            </Alert>
        )
    }

    return (
        <>
            {addModal()}
            <Stack gap={2}>                
                {renderList()}
                {errorMessage()}
                <Button variant="primary" onClick={() => setNewDesc('')}>Add group</Button>
            </Stack>
        </>

    )
}

export default GroupList