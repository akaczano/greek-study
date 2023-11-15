import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { defaultInfo, setInfo } from "../../state/practiceSlice";

function StartPractice() {

    const dispatch = useDispatch()

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    No study sets available
                </Card.Title>
                <Card.Text>
                    You currently don't have any terms to practice. Create a new set
                    by selecting some terms.
                </Card.Text>

                <Button variant="success" onClick={() => dispatch(setInfo(defaultInfo))}>
                    Get started
                </Button>

            </Card.Body>
        </Card>
    )

}

export default StartPractice