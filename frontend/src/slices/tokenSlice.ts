import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  access: "",
  refresh: "", 
}
export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    changeAccess: (state, action: PayloadAction<string>) => {
        state.access = action.payload;
        localStorage.setItem("accessToken", action.payload);
    },
    changeRefresh: (state, action: PayloadAction<string>) => {
        state.refresh = action.payload;
        localStorage.setItem("refreshToken", action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeAccess, changeRefresh } = tokenSlice.actions

export default tokenSlice.reducer