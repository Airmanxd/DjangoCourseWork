import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTags: [],
  tags: [],
  tempTags: [],
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addToActive: (state, action) => {
      state.activeTags = [...state.activeTags, action.payload];
      state.tempTags.splice(state.tempTags.indexOf(action.payload), 1);
    },
    fillTags: (state, action) => {
      state.tags = action.payload;
      state.tempTags = action.payload;
    },
    removeFromActive: (state, action) => {
      state.tempTags.push(
        state.activeTags.splice(
          state.activeTags.indexOf(action.payload), 1)[0]);
    },
  }
})

// Action creators are generated for each case reducer function
export const { addToActive, fillTags, removeFromActive } = tagsSlice.actions

export default tagsSlice.reducer