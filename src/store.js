import { configureStore } from "@reduxjs/toolkit"; 
import thunk from 'redux-thunk'

import navReducer from './state/navSlice'

const initialState = {}
const middleware = [thunk]

const store = configureStore({
    reducer: {        
        nav: navReducer
    },
    initialState,
    middleware    
})
export default store;
