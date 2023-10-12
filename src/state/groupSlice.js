import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadGroups = createAsyncThunk('group:list', async (_, thunkAPI) => {
    const [status, result] = await window.model.query('group:list', [])
    if (!status) return thunkAPI.rejectWithValue(result)
    else return result
})

export const addGroup = createAsyncThunk('group:add', async (description, thunkAPI) => {
    const [status, result] = await window.model.query('group:add', [description])
    if (!status) return thunkAPI.rejectWithValue(result)
    else return result
})

export const updateGroup = createAsyncThunk('group:update', async (_, thunkAPI) => {
    const { id, description } = thunkAPI.getState().group.update
    const [status, result] = await window.model.query('group:update', [id, description])
    if (!status || result !== 1) return thunkAPI.rejectWithValue(result)
    else return result
})

export const removeGroup = createAsyncThunk('group:remove', async (id, thunkAPI) => {
    const [status, result] = await window.model.query('group:remove', [id])
    if (!status) return thunkAPI.rejectWithValue(result)
    else return result
})


const initialState = {
    list: [],
    loading: false,
    posting: false,
    update: {
        id: -1,
        description: ''
    },
    deleting: [],
    error: null,
    loadError: null
}

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setUpdate: (state, { payload }) => {
            state.update = payload
        },
        clearError: state => {
            state.error = null
        }
    },
    extraReducers: builder => {
        builder.addCase(loadGroups.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(loadGroups.fulfilled, (state, { payload }) => {
            state.loading = false
            state.list = payload
        })
        builder.addCase(loadGroups.rejected, (state, { payload }) => {
            state.loading = false
            state.loadError = payload
        })
        builder.addCase(addGroup.pending, (state) => {
            state.posting = true
            state.error = null
        })
        builder.addCase(addGroup.fulfilled, (state, action) => {
            state.posting = false
            state.list.push({ id: action.payload, description: action.meta.arg })
        })
        builder.addCase(addGroup.rejected, (state, { payload }) => {
            state.posting = false
            state.error = payload
        })
        builder.addCase(updateGroup.pending, (state) => {
            state.posting = true
            state.error = null
        })
        builder.addCase(updateGroup.fulfilled, (state) => {
            state.posting = false
            state.list = [...state.list.filter(e => e.id !== state.update.id), state.update]
            state.update = {id: -1, description: ''}
        })
        builder.addCase(updateGroup.rejected, (state, { payload }) => {
            state.posting = false
            state.error = payload
        })
        builder.addCase(removeGroup.pending, (state, action) => {
            state.deleting.push(action.meta.arg)
            state.error = null
        })
        builder.addCase(removeGroup.fulfilled, (state, action) => {
            state.deleting = state.deleting.filter(e => e !== action.meta.arg)
            state.list = state.list.filter(e => e.id !== action.meta.arg)
        })
        builder.addCase(removeGroup.rejected, (state, action) => {
            state.deleting = state.deleting.filter(e => e !== action.meta.arg)
            state.error = action.payload
        })
    }
})

export const { setUpdate, clearError } = groupSlice.actions
export default groupSlice.reducer
