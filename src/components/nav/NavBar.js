import { useDispatch } from 'react-redux'
import { go, VOCAB, NOTES, PRACTICE } from '../../state/navSlice'
import { Navbar, Nav, Container } from 'react-bootstrap'



function NavBar() {

    const dispatch = useDispatch()

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>Gnosis</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => dispatch(go(VOCAB))}>Vocabulary</Nav.Link>
                        <Nav.Link onClick={() => dispatch(go(NOTES))}>Notes</Nav.Link>
                        <Nav.Link onClick={() => dispatch(go(PRACTICE))}>Practice</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar