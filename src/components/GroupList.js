
import { useEffect, useState } from 'react'
import { ButtonGroup, ListGroup, Spinner, Stack, Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { loadGroups, setUpdate, addGroup, updateGroup, removeGroup } from '../state/groupSlice'

function GroupList() {

    const dispatch = useDispatch()
    const {
        list, loading, error, update, posting, deleting
    } = useSelector(s => s.group)


    useEffect(() => {
        dispatch(loadGroups())
    }, [dispatch])


    const [newDesc, setNewDesc] = useState(null)
    
    const addModal = () => {
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
        const display = g.id === update.id ?
            (
                <Stack direction="horizontal" gap={2}>
                    <Form.Control
                        type="text"
                        style={{ maxWidth: '80%' }}
                        value={update.description || ''}
                        onChange={e => dispatch(setUpdate({ ...update, description: e.target.value }))} />
                    <Button onClick={() => dispatch(updateGroup())} disabled={posting}>Save</Button>
                    <Button onClick={() => dispatch(setUpdate({ id: -1, description: '' }))} disabled={posting}>Cancel</Button>
                </Stack>

            ) :
            (
                <span onDoubleClick={() => dispatch(setUpdate(g))}>
                    {g.description}
                </span>
            )

        return (
            <ListGroup.Item key={`group_${g.id}`}>
                <Stack direction="horizontal" style={{ width: '100%' }}>
                    <div style={{ width: '50%' }}>
                        {display}
                    </div>
                    <div style={{ marginLeft: '60%' }}>
                        <ButtonGroup >
                            <Button
                                variant="secondary"
                                onClick={() => dispatch(removeGroup(g.id))}
                                disabled={deleting.includes(g.id)}
                            >
                                Remove
                            </Button>
                        </ButtonGroup>
                    </div>
                </Stack>
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
        else if (error) {
            return (
                <div>
                    <p style={{ color: 'red' }}>{error}</p>
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

    return (
        <>
            {addModal()}
            <Stack gap={2}>
                <h3>Groups</h3>
                {renderList()}
                <Button variant="primary" onClick={() => setNewDesc('')}>Add group</Button>
            </Stack>
        </>

    )
}

export default GroupList