import { configureStore } from '@reduxjs/toolkit'
import tagsReducer from './slices/tagsSlice'
import loginReducer from "./slices/loginSlice"
import tokenReducer from "./slices/tokenSlice"
import formsReducer from "./slices/formsSlice"
import loadingReducer from './slices/loadingSlice'
import alertsReducer from './slices/alertsSlice'
export const store = configureStore({
  reducer: {
    login: loginReducer,
    token: tokenReducer,
    tags: tagsReducer,
    forms: formsReducer,
    loading: loadingReducer,
    alerts: alertsReducer,
  },
})