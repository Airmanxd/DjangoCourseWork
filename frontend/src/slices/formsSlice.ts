import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  loginForm: false,
  uploadForm: false,
  updateForm: false,
  signUpForm: false
}

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    toggleLoginForm: (state) => {state.loginForm = !state.loginForm},
    toggleUploadForm: (state) =>{state.uploadForm = !state.uploadForm},
    toggleUpdateForm: (state) =>{state.updateForm = !state.updateForm},
    toggleSignUpForm: (state) =>{state.signUpForm = !state.signUpForm}
  },
})

// Action creators are generated for each case reducer function
export const { toggleLoginForm, toggleUploadForm, toggleUpdateForm, toggleSignUpForm } = formsSlice.actions

export default formsSlice.reducer