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
                const maxPosition = state.content.chapters.filter(c => c.parent == "").map(c => c.position).reduce((a, b) => a >= b ? a : b, -1)
                state.content.chapters.push({ description: payload, attempts: 0, last_studied: null, words: [], position: maxPosition + 1, parent: "" })
            }
        },
        addFolder: (state, { payload }) => {
            if (state.content?.chapters) {                
                const maxPosition = state.content.chapters.filter(c => c.parent == "").map(c => c.position).reduce((a, b) => a >= b ? a : b, -1)
                state.content.chapters.push({ description: payload, attempts: 0, last_studied: null, position: maxPosition + 1, parent: "" })
            }
        },
        deleteChapter: (state, { payload }) => {
            state.content.chapters = state.content.chapters.filter(c => c.description != payload)
        },
        moveUp: (state, { payload }) => {
            const target = state.content.chapters.filter(c => c.description == payload)[0]
            const previous = state.content.chapters
                .filter(c => c.parent == target.parent)                
                .filter(c => c.position < target.position)
                .reduce((s, a) => s.position >= a.position ? s : a, {position: -1})
            
            if (previous.description) {
                const otherItems = state.content.chapters.filter(c => c.description != previous.description && c.description != payload)
                state.content.chapters = [...otherItems, {...target, position: previous.position }, {...previous, position: target.position }]                
            }            
        },
        moveDown: (state, { payload }) => {
            const target = state.content.chapters.filter(c => c.description == payload)[0]
            const next = state.content.chapters
                .filter(c => c.parent == target.parent)                
                .filter(c => c.position > target.position)
                .reduce((s, a) => s.position <= a.position ? s : a, {position: 10000})
            
            if (next.description) {
                const otherItems = state.content.chapters.filter(c => c.description != next.description && c.description != payload)
                state.content.chapters = [...otherItems, {...target, position: next.position }, {...next, position: target.position }]                
            }    
        },
        moveChapter: (state, { payload }) => {
            const [source, dest] = payload
            const others = state.content.chapters.filter(c => c.description != source.description)
            const maxPosition = others.filter(c => c.parent == dest).map(c => c.position).reduce((s, a) => s >= a ? s : a, -1)
            state.content.chapters = [...others, {...source, position: maxPosition + 1, parent: dest}]
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
        },
        addMiscChart: (state, { payload }) => {            
            if (state.content?.charts) {                
                const maxPosition = state.content.charts.filter(c => c.parent == "").map(c => c.position).reduce((a, b) => a >= b ? a : b, -1)
                state.content.charts.push({ description: payload, chart: [], rowLabels: [], columnLabels: [], position: maxPosition + 1, parent: "" })
            }
        },
        updateMiscChart: (state, action) => {
            const chart = action.payload
            const newCharts = [...state.content.charts.filter(c => c.description != chart.description), chart]            
            state.content.charts = newCharts
        },
        addMiscChartFolder: (state, { payload }) => {
            if (state.content?.charts) {                
                const maxPosition = state.content.charts.filter(c => c.parent == "").map(c => c.position).reduce((a, b) => a >= b ? a : b, -1)
                state.content.charts.push({ description: payload, position: maxPosition + 1, parent: "" })
            }
        },
        deleteMiscChart: (state, { payload }) => {
            state.content.charts = state.content.charts.filter(c => c.description != payload)
        },
        moveUpMiscChart: (state, { payload }) => {
            const target = state.content.charts.filter(c => c.description == payload)[0]
            const previous = state.content.charts
                .filter(c => c.parent == target.parent)                
                .filter(c => c.position < target.position)
                .reduce((s, a) => s.position >= a.position ? s : a, {position: -1})
            
            if (previous.description) {
                const otherItems = state.content.charts.filter(c => c.description != previous.description && c.description != payload)
                state.content.charts = [...otherItems, {...target, position: previous.position }, {...previous, position: target.position }]                
            }            
        },
        moveDownMiscChart: (state, { payload }) => {
            const target = state.content.charts.filter(c => c.description == payload)[0]
            const next = state.content.charts
                .filter(c => c.parent == target.parent)                
                .filter(c => c.position > target.position)
                .reduce((s, a) => s.position <= a.position ? s : a, {position: 10000})
            
            if (next.description) {
                const otherItems = state.content.charts.filter(c => c.description != next.description && c.description != payload)
                state.content.charts = [...otherItems, {...target, position: next.position }, {...next, position: target.position }]                
            }    
        },
        moveMiscChart: (state, { payload }) => {
            const [source, dest] = payload
            const others = state.content.charts.filter(c => c.description != source.description)
            const maxPosition = others.filter(c => c.parent == dest).map(c => c.position).reduce((s, a) => s >= a ? s : a, -1)
            state.content.charts = [...others, {...source, position: maxPosition + 1, parent: dest}]
        }   
    }
})

export const {
    setContent,
    addChapter,    
    deleteChapter,
    addFolder,
    addTerm,
    deleteTerm,
    updateChart,
    deleteChart,
    updateVerbChart,
    deleteVerbChart,
    moveUp,
    moveDown,
    moveChapter,
    addMiscChart,
    addMiscChartFolder,
    updateMiscChart,
    deleteMiscChart,
    moveUpMiscChart,
    moveDownMiscChart,
    moveMiscChart

} = contentSlice.actions

export default contentSlice.reducer