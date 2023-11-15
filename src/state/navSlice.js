import { createSlice } from "@reduxjs/toolkit";

export const NOTES = 0;
export const VOCAB = 1;
export const CHARTS = 2;
export const PRACTICE = 3

const initialState = {
    location: VOCAB
}

const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        go: (state, { payload }) => {
            state.location = payload
        }
    }
})

export const { go } = navSlice.actions
export default navSlice.reducer