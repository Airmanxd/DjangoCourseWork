import { configureStore } from '@reduxjs/toolkit'
import loginReducer from "./slices/loginSlice"
import tokenReducer from "./slices/tokenSlice"
export const store = configureStore({
  reducer: {
    login: loginReducer,
    token: tokenReducer
  },
})