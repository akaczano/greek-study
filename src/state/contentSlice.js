import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    content: null,
    readOnly: true,
    source: "https://raw.githubusercontent.com/akaczano/greek-study/master/vocab.json"
}

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setContent: (state, action) => {
            const { content, readOnly } = action.payload
            state.content = content
            state.readOnly = readOnly
        },
        addChapter: (state, { payload }) => {
            if (state.content?.chapters) {
                state.content.chapters.push({ description: payload, attempts: 0, last_studied: null, words: [] })
            }
        },
        deleteChapter: (state, { payload }) => {
            state.content.chapters = state.content.chapters.filter(c => c.description != payload)
        },
        addTerm: (state, action) => {
            const [chapterName, term] = action.payload

            const chapter = state.content.chapters.filter(c => c.description == chapterName)[0]
            const otherChapters = state.content.chapters.filter(c => c.description != chapterName)
        
            const newChapters = [
              ...otherChapters,
              {
                ...chapter, words: [...chapter.words.filter(t => t.greek != term.initialGreek), {
                  english: term.english,
                  greek: term.greek,
                  type: term.type,
                  takesCase: term.takesCase
                }]
              }
            ]
            state.content.chapters = newChapters
        },
        deleteTerm: (state, action) => {
            const [chapterName, greek] = action.payload
            const chapter = state.content.chapters.filter(c => c.description == chapterName)[0]
            const otherChapters = state.content.chapters.filter(c => c.description != chapterName)
            const newVocab = [
              ...otherChapters,
              { ...chapter, words: chapter.words.filter(w => w.greek != greek) }
            ]
            state.content.chapters = newVocab
        },
        updateChart: (state, action) => {
            const chart = action.payload
            const newCharts = [...state.content.declensions.filter(c => c.description != chart.description), chart]
            state.content.declensions = newCharts
        },
        deleteChart: (state, action) => {
            const chartName = action.payload
            state.content.declensions = [...state.content.declensions.filter(c => c.description != chartName)]
        },
        updateVerbChart: (state, action) => {
            const chart = action.payload
            const newVerbs = [...state.content.verbs.filter(c => c.description != chart.description), chart]            
            state.content.verbs = newVerbs
        },
        deleteVerbChart: (state, action) => {
            const chartName = action.payload
            state.content.verbs = [...state.content.verbs.filter(c => c.description != chartName)]
        }         
    }
})

export const {
    setContent,
    addChapter,
    deleteChapter,
    addTerm,
    deleteTerm,
    updateChart,
    deleteChart,
    updateVerbChart,
    deleteVerbChart
} = contentSlice.actions

export default contentSlice.reducer