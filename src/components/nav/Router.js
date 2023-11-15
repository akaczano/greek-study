import { useSelector } from "react-redux" 
import { PRACTICE, VOCAB } from "../../state/navSlice"
import VocabLanding from "../vocab/VocabLanding"
import PracticeLanding from "../practice/PracticeLanding"


function Router() {
    const { location } = useSelector(s => s.nav)

    if (location === VOCAB) {
        return (
            <VocabLanding />
        )
    }
    else if (location === PRACTICE) {
        return <PracticeLanding />
    }

}
export default Router