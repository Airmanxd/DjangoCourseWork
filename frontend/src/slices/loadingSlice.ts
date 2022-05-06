import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const ladingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    isLoading: (state) => {state.value = true},
    isNotLoading: (state) => {state.value = false},
  },
})

// Action creators are generated for each case reducer function
export const { isLoading, isNotLoading } = ladingSlice.actions

export default ladingSlice.reducer