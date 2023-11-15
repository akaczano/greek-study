import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const defaultInfo = {
    mode: 0,
    checkAccents: 0,
    fullLexical: 0,
    group: -1,
    pos: -1,
    limit: 5,
    sort: 0,
    ordering: 0
}

export const loadSet = createAsyncThunk('study:get', async (_, thunkAPI) => {
    try {
        const [status, setResult] = await window.model.query('study:get')
        if (!status) return thunkAPI.rejectWithValue(setResult)
        return setResult
    }
    catch (err) {
        console.log(err)
    }
})

export const loadTerm = createAsyncThunk('study:next', async (_, thunkAPI) => {
    try {
        const [status, result, extra] = await window.model.query('study:next')
        if (!status) return thunkAPI.rejectWithValue(result)        
        return [result, extra]
    } catch(err) {
        console.log(err)
    }
})

export const updateTerm = createAsyncThunk('study:attempt', async (grade, thunkAPI) => {
    const { currentTerm } = thunkAPI.getState().practice
    const [status, result] = await window.model.query('study:attempt', [currentTerm.id, grade])
    if (!status) return thunkAPI.rejectWithValue(result)
})

export const createSet = createAsyncThunk('study:create', async (_, thunkAPI) => {
    const { setInfo } = thunkAPI.getState().practice
    const [status, result] = await window.model.query('study:create', [setInfo])
    if (!status) return thunkAPI.rejectWithValue(result)
})

export const cancelSet = createAsyncThunk('study:cancel', async (_, thunkAPI) => {
    const [status, result] = await window.model.query('study:cancel')
    if (!status) return thunkAPI.rejectWithValue(result)
})

const initialState = {
    currentSet: {
        set: null,
        loading: false,
        posting: false,
        error: null
    },
    currentTerm: {
        loading: false,
        term: null,
        error: null
    },
    setInfo: null,
    posting: false,
    postError: null,
    canceling: false,
    reviewList: []
}


const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        setInfo: (state, action) => {
            state.setInfo = action.payload
        },
        setReviewList: (state, action) => {
            state.reviewList = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(loadSet.pending, state => {
            state.currentSet.loading = true
        })
        builder.addCase(loadSet.rejected, (state, action) => {
            state.currentSet.pending = false
            state.currentSet.error = action.payload
        })
        builder.addCase(loadSet.fulfilled, (state, action) => {
            state.currentSet.loading = false
            state.currentSet.error = null
            state.currentSet.set = action.payload
        })
        builder.addCase(loadTerm.pending, (state) => {
            state.currentTerm.loading = true
        })
        builder.addCase(loadTerm.rejected, (state, action) => {
            state.currentTerm.loading = false
            state.currentTerm.error = action.payload
        })
        builder.addCase(loadTerm.fulfilled, (state, action) => {
            state.currentTerm.loading = false
            state.currentTerm.error = null
            state.currentTerm.line = action.payload[0]
            state.currentTerm.term = action.payload[1]
        })
        builder.addCase(createSet.pending, (state) => {
            state.currentSet.posting = true
        })
        builder.addCase(createSet.rejected, (state, action) => {
            state.currentSet.posting = false
            state.currentSet.error = action.payload
        })
        builder.addCase(createSet.fulfilled, (state) => {
            state.currentSet.posting = false
            state.currentSet.error = null
            state.setInfo = null
        })
        builder.addCase(cancelSet.pending, (state) => {
            state.canceling = true
        })
        builder.addCase(cancelSet.rejected, (state) => {
            state.canceling = false
        })
        builder.addCase(cancelSet.fulfilled, (state) => {
            state.canceling = false
            state.currentSet.set = null
        })
    }
})

export const { setInfo, setReviewList } = practiceSlice.actions

export default practiceSlice.reducer