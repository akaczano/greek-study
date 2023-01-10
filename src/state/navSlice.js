import { createSlice } from '@reduxjs/toolkit'

export const LANDING = 0
export const CHAPTER_LIST = 1;
export const CHAPTER_VIEW = 2;
export const VOCAB_QUIZ = 3;
export const NOUNS = 4;
export const CHART_DISPLAY = 5;
export const CHART_QUIZ = 6;
export const NOUN_QUIZ = 7;
export const VERBS = 8;
export const VERB_DISPLAY = 9;
export const VERB_QUIZ = 10;
export const KEYBOARD = 11;

const initialState = {
  location: LANDING,
  params: {}
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    go: (state, action) => {
      const [loc, params] = action.payload
      state.location = loc
      state.params = params
    }
  },
})

// Action creators are generated for each case reducer function
export const { go } = navSlice.actions

export default navSlice.reducer