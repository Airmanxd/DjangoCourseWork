import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loginForm: false,
  uploadForm: false,
  updateForm: false,
}

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    toggleLoginForm: (state) => {state.loginForm = !state.loginForm},
    toggleUploadForm: (state) =>{state.uploadForm = !state.uploadForm},
    toggleUpdateForm: (state) =>{state.updateForm = !state.updateForm}
  },
})

// Action creators are generated for each case reducer function
export const { toggleLoginForm, toggleUploadForm, toggleUpdateForm } = formsSlice.actions

export default formsSlice.reducer