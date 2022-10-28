import { Container, Row, Col, Card, Button } from 'react-bootstrap'


function Landing(props) {
    return (<>
        <Row style={{ padding: '10px', background: 'linear-gradient(#28805c, #2edb96)' }}>
            <h1 style={{ color: 'white' }}>Welcome to Greek Study!</h1>
        </Row>
        <Row style={{ height: '6px', background: 'linear-gradient(to right, #11a899, #16f7e0)' }}></Row>        
        <Container>
            <Row style={{ marginTop: '10px' }}>
                <p>
                    Greek Study is your one stop shop for learning vocab, memorizing
                    verb forms, and practicing noun declension.
                </p>
            </Row>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Vocabulary
                            </Card.Title>
                            <Card.Text>
                                Manage vocab lists and practice translating words.
                            </Card.Text>
                            <Button variant="primary" onClick={props.onVocab}>Get started</Button>
                        </Card.Body>
                    </Card>
                </Col >
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Nouns
                            </Card.Title>
                            <Card.Text>
                                Practice declensions
                            </Card.Text>
                            <Button variant="primary" onClick={props.onNouns}>Get started</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Verbs
                            </Card.Title>
                            <Card.Text>
                                Practice conjugation and translation with various verbs in a
                                bunch of different tenses.
                            </Card.Text>
                            <Button variant="primary" onClick={props.onVerbs}>Get started</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
    )
}

export default Landing