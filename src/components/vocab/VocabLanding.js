import { Row, Col } from 'react-bootstrap'
import GroupList from './GroupList'
import TermList from './TermList'

function VocabLanding() {
    return (
        <div style={{ padding: '20px'}}>
            <Row>
                <Col md={4}>
                    <h5>Groups</h5>
                </Col>
                <Col md={8}>
                    <h5>Terms</h5>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <GroupList />
                </Col>
                <Col md={8}>
                    <TermList />
                </Col>
            </Row>
        </div>
    )

}

export default VocabLanding