import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  alerts: [],
  alertId: 0,
}

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addErrorAlert: (state, action) => {
        state.alerts.push({id : state.alertId++, message : action.payload, color : "danger"});
    },
    addInfoAlert: (state, action) => {
        state.alerts.push({id : state.alertId++, message : action.payload, color : "info"});
    },
    removeFromAlerts: (state, action) => {
        state.alerts = state.alerts.filter( ({id}) => id!==action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addErrorAlert, addInfoAlert, removeFromAlerts } = alertsSlice.actions

export default alertsSlice.reducer