import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    activate: (state) => {state.value = true},
    deactivate: (state) => {state.value = false},
  },
})

// Action creators are generated for each case reducer function
export const { activate, deactivate } = loginSlice.actions

export default loginSlice.reducer