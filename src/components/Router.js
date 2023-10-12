import { useSelector } from "react-redux" 
import { VOCAB } from "../state/navSlice"
import VocabLanding from "./VocabLanding"


function Router() {
    const { location } = useSelector(s => s.nav)

    if (location === VOCAB) {
        return (
            <VocabLanding />
        )
    }

}
export default Router