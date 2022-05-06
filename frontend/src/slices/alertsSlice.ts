import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AlertType{
  id: number;
  color: string;
  message: string;
}

interface AlertsState {
  alerts: AlertType[];
  alertId: number;
}

const initialState: AlertsState = {
  alerts: [],
  alertId: 0,
}

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addErrorAlert: (state, action: PayloadAction<string>) => {
        state.alerts.push({id : state.alertId++, message : action.payload, color : "danger"});
    },
    addInfoAlert: (state, action: PayloadAction<string>) => {
        state.alerts.push({id : state.alertId++, message : action.payload, color : "info"});
    },
    removeFromAlerts: (state, action: PayloadAction<number>) => {
        state.alerts = state.alerts.filter( ({id}) => id!==action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addErrorAlert, addInfoAlert, removeFromAlerts } = alertsSlice.actions

export default alertsSlice.reducer