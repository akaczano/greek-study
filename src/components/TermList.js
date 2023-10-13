import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Spinner, Stack, Table, Form, Button, Row, Col } from 'react-bootstrap'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { BsFillTrashFill } from 'react-icons/bs'

import { POS, cases } from '../util/util'
import { defaultTerm, loadTerms, setFilter, setLimit, setOffset, setNewTerm, removeTerm } from '../state/termSlice'
import TermModal from './TermModal'
import { updateText } from '../util/input'

function TermList() {

    const {
        list,
        count,
        loading,        
        error,
        filter,
        deleting,
        offset,
        limit,       
        posting 
    } = useSelector(state => state.term)


    const dispatch = useDispatch()

    useEffect(() => {
        if (!posting) {
            dispatch(loadTerms())
        }
    }, [dispatch, filter, offset, limit, posting, deleting])

    const [searchMode, setSearchMode] = useState(0)



    const renderRow = (t, i) => {
        return (
            <tr key={`term_${t.id}`}>
                <td>{i + 1}</td>
                <td onClick={() => dispatch(setNewTerm(t))}>{t.term}</td>
                <td>{t.definition}</td>
                <td>{cases[t.case]}</td>
                <td>{POS[t.pos]}</td>
                <td>
                    <Button size="sm" variant="danger" disabled={deleting.includes(t.id)} onClick={() => dispatch(removeTerm(t.id))}>
                        <BsFillTrashFill />
                    </Button>
                </td>
            </tr>
        )
    }


    const getControls = () => {

        const updateSearchTerm = e => {
            if (searchMode === 0 && e.nativeEvent.data) {
                updateText(e, str => dispatch(setFilter({ ...filter, termFilter: str, definitionFilter: '' })))
            }
            else if (searchMode === 0) {
                dispatch(setFilter({ ...filter, termFilter: e.target.value, definitionFilter: '' }))
            }
            else {
                dispatch(setFilter({ ...filter, definitionFilter: e.target.value, termFilter: '' }))
            }
        }

        return (
            <Row>
                <Col md={5}>
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
                <Col md={2}>
                    <Form.Select value={filter.pos} onChange={e => dispatch(setFilter({ ...filter, pos: e.target.value }))}>
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
                <Col md={1}>
                    {loading ? <Spinner animation="border" variant="info" /> : null}
                </Col>

            </Row>
        )
    }

    const getPagination = () => {

        const pn = offset / limit + 1
        const setPageNumber = pn => {

            const offset = (parseInt(pn) - 1) * limit
            dispatch(setOffset(offset))
        }

        return (
            <Stack gap={2} direction="horizontal">
                <Button variant="secondary" disabled={offset === 0} size="sm" onClick={() => setPageNumber(pn - 1)}>
                    <IoIosArrowBack />
                </Button>
                <Form.Control type="number" style={{ maxWidth: '50px' }} value={pn} size="sm" onChange={e => setPageNumber(e.target.value)} />
                <Button variant="secondary" size="sm" onClick={() => setPageNumber(pn + 1)} disabled={limit + offset >= count}>
                    <IoIosArrowForward />
                </Button>
                <Form.Control type="number" style={{ maxWidth: '75px', marginLeft: '25px' }} value={limit} size="sm" onChange={e => dispatch(setLimit(parseInt(e.target.value)))} />
                <span>per page</span>
                <span style={{ marginLeft: '20px' }}>({count} total terms)</span>
            </Stack>
        )

    }

    const getDisplay = () => {
        if (error) {
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
                    No terms found.
                </p>
            )
        }
        else {

            return (
                <div style={{ maxHeight: '75vh', overflowY: 'auto'}}>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Term</th>
                                <th>Definition</th>
                                <th>Special Case</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.slice().sort((t1, t2) => t1.term.localeCompare(t2.term)).map(renderRow)}
                        </tbody>
                    </Table>
                </div>
            )
        }
    }

    return (
        <>
            <TermModal />
            <Stack gap={3}>
                {getControls()}
                {getDisplay()}
                {getPagination()}
            </Stack>
        </>

    )

}

export default TermList