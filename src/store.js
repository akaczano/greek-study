import { configureStore } from "@reduxjs/toolkit"; 
import thunk from 'redux-thunk'

import navReducer from './state/navSlice'
import groupReducer from './state/groupSlice'
import termReducer from './state/termSlice'
import practiceReducer from './state/practiceSlice'

const initialState = {}
const middleware = [thunk]

const store = configureStore({
    reducer: {        
        nav: navReducer,
        group: groupReducer,
        term: termReducer,
        practice: practiceReducer
    },
    initialState,
    middleware    
})
export default store;
