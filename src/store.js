import { configureStore } from "@reduxjs/toolkit"; 
import thunk from 'redux-thunk'

import navReducer from './state/navSlice'
import groupReducer from './state/groupSlice'
import termReducer from './state/termSlice'

const initialState = {}
const middleware = [thunk]

const store = configureStore({
    reducer: {        
        nav: navReducer,
        group: groupReducer,
        term: termReducer
    },
    initialState,
    middleware    
})
export default store;
