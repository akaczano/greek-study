import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { loadSet, loadTerm } from "../../state/practiceSlice"
import StartPractice from "./StartPractice"
import { Container, Row, Col, Spinner } from "react-bootstrap"
import SetForm from "./SetForm"
import TermDisplay from "./TermDisplay"

function PracticeLanding() {

    const dispatch = useDispatch()

    const {
        currentSet,
        currentTerm,
        setInfo,
        canceling
    } = useSelector(state => state.practice)

    const setId = currentSet.set?.id

    useEffect(() => {        
        if (!setInfo) {            
            dispatch(loadSet())
        }

    }, [dispatch, setInfo])
    

    useEffect(() => {
        if (currentSet.set && !currentSet.set.completed_time) {            
            dispatch(loadTerm())
        }
    }, [dispatch, setId])

    

    const getContent = () => {
        if (currentSet.loading || currentTerm.loading) {
            return <Spinner animation="border" />
        }
        else if (currentSet.error) {
            return (
                <p style={{ color: 'red'}}>
                    {currentSet.error.message}
                </p>
            )
        }
        else if (setInfo) {
            return <SetForm />
        }
        else if (!currentSet.set) {
            return <StartPractice />
        }
        else {
            return <TermDisplay />
        }
    }


    return (
        <Container>

            <div style={{ paddingTop: '5vh' }}>
                <div style={{ paddingBottom: '10px' }}>
                    <h2>Practice vocab</h2>
                </div>

                {getContent()}
            </div>
        </Container>
    )

}

export default PracticeLanding