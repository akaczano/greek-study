import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const loadTerms = createAsyncThunk(
    'term:list', async (_, thunkAPI) => {        
        const { filter, offset, limit } = thunkAPI.getState().term
        const [status, result] = await window.model.query('term:list', [offset, limit, filter])        
        if (!status) return thunkAPI.rejectWithValue(result)
        return result
    }
)

export const addTerm = createAsyncThunk(
    'term:add', async (_, thunkAPI) => {
        const { newTerm } = thunkAPI.getState().term
        const [status, result] = await window.model.query('term:add', [newTerm])
        if (!status) return thunkAPI.rejectWithValue(result)
        return result
    }
)

export const updateTerm = createAsyncThunk(
    'term:update', async (_, thunkAPI) => {
        const { newTerm } = thunkAPI.getState().term        
        const [status, result] = await window.model.query('term:update', [newTerm])
        if (!status) return thunkAPI.rejectWithValue(result)
        return result
    }
)

export const removeTerm = createAsyncThunk(
    'term:remove', async (id, thunkAPI) => {
        const [status, result] = await window.model.query('term:remove', id)
        if (!status) return thunkAPI.rejectWithValue(result)
        return result
    }
)

export const defaultTerm = {
    term: '',
    definition: '',
    case: 0,
    pos: 0,
    notes: '',
    pps: ['', '', '', '', '', ''],
    groups: []
}


const initialState = {
    list: [],
    loading: false,
    posting: false,
    deleting: [],
    error: null,
    newTerm: null,
    filter: {
        termFilter: '',
        definitionFilter: '',
        group: -1,
        pos: [0, 1, 2, 3, 4, 5]
    },
    offset: 0,
    limit: 50
}

const termSlice = createSlice({
    name: 'term',
    initialState,
    reducers: {
        setFilter: (state, { payload }) => {
            state.filter = payload
        },
        setNewTerm: (state, { payload }) => {
            state.newTerm = payload
        }
    },
    extraReducers: builder => {
        builder.addCase(loadTerms.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(loadTerms.fulfilled, (state, { payload }) => {
            state.loading = false
            state.list = payload
        })
        builder.addCase(loadTerms.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })
        builder.addCase(addTerm.pending, (state) => {
            state.posting = true
            state.error = null
        })
        builder.addCase(addTerm.fulfilled, (state, action) => {
            state.posting = false
            state.list.push({ id: action.payload, description: action.meta.arg })
        })
        builder.addCase(addTerm.rejected, (state, { payload }) => {
            state.posting = false
            state.error = payload
        })
        builder.addCase(updateTerm.pending, (state) => {
            state.posting = true
            state.error = null
        })
        builder.addCase(updateTerm.fulfilled, (state) => {
            state.posting = false
            state.list = [...state.list.filter(e => e.id !== state.newTerm.id), state.newTerm]    
            state.newTerm = null        
        })
        builder.addCase(updateTerm.rejected, (state, { payload }) => {
            state.posting = false
            state.error = payload
        })
        builder.addCase(removeTerm.pending, (state, action) => {
            state.deleting.push(action.meta.arg)
            state.error = null
        })
        builder.addCase(removeTerm.fulfilled, (state, action) => {
            state.deleting = state.deleting.filter(e => e !== action.meta.arg)
            state.list = state.list.filter(e => e.id !== action.meta.arg)
        })
        builder.addCase(removeTerm.rejected, (state, action) => {
            state.deleting = state.deleting.filter(e => e !== action.meta.arg)
            state.error = action.payload
        })
    }
})

export const { setFilter, setNewTerm } = termSlice.actions
export default termSlice.reducer