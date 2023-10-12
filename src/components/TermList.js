import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Spinner, Stack, Table, Form, Button, Row, Col } from 'react-bootstrap'

import { POS, cases } from '../util/util'
import { defaultTerm, loadTerms, setFilter, setNewTerm } from '../state/termSlice'
import TermModal from './TermModal'

function TermList() {

    const {
        list,
        loading,
        posting,
        error,
        filter,
        deleting,
        offset,
        limit,
        newTerm
    } = useSelector(state => state.term)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadTerms())
    }, [dispatch, filter, offset, limit])

    const [searchMode, setSearchMode] = useState(0)



    const renderRow = t => {
        return (
            <tr key={`term_${t.id}`} onClick={() => dispatch(setNewTerm(t))}>
                <td>{t.term}</td>
                <td>{t.definition}</td>
                <td>{cases[t.case]}</td>
                <td>{POS[t.pos]}</td>
            </tr>
        )
    }


    const getControls = () => {

        const updateSearchTerm = e => {
            if (searchMode === 0) {
                dispatch(setFilter({ ...filter, termFilter: e.target.value, definitionFilter: '' }))
            }
            else {
                dispatch(setFilter({ ...filter, definitionFilter: e.target.value, termFilter: '' }))
            }
        }

        return (
            <Row>
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="search"
                        value={searchMode === 0 ? filter.termFilter : filter.definitionFilter}
                        onChange={updateSearchTerm} />
                </Col>
                <Col md={2}>
                    <Form.Select value={searchMode} onChange={e => setSearchMode(e.target.value)}>
                        <option value={0}>Term</option>
                        <option value={1}>Definition</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select>
                        <option value={-1}>All</option>
                        {POS.map((name, i) => {
                            return (
                                <option key={`partofspeech_${i}`} value={i}>{name}</option>
                            )
                        })}
                    </Form.Select>
                </Col>
                <Col>
                    <Button onClick={() => dispatch(setNewTerm(defaultTerm))}>Add term</Button>
                </Col>

            </Row>
        )
    }

    const getPagination = () => {

    }

    const getDisplay = () => {
        if (loading) {
            return (
                <Stack direction="horizontal">
                    <p>Loading terms</p>
                    <Spinner animation="border" />
                </Stack>
            )
        }
        else if (error) {
            return (
                <Stack direction="vertical">
                    <h3>There was a problem loading terms</h3>
                    <p style={{ color: 'red' }}>{error.message}</p>
                </Stack>
            )
        }
        else if (list.length < 1) {
            return (
                <p>
                    You don't have any terms yet
                </p>
            )
        }
        else {
            return (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>Definition</th>
                            <th>Special Case</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.slice().sort((t1, t2) => t1.term.localeCompare(t2.term)).map(renderRow)}
                    </tbody>
                </Table>
            )
        }
    }

    return (
        <>
            <TermModal />
            <Stack gap={3}>
                {getControls()}
                {getDisplay()}
            </Stack>
        </>

    )

}

export default TermList