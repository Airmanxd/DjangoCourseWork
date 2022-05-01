import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTags: [],
  tags: [],
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
    updateTags: (state, action) => {
      state.tags = state.tags.concat(state.tags.filter( tag => !state.tags.includes(tag)));
    }
  }
})

// Action creators are generated for each case reducer function
export const { addToActive, fillTags, removeFromActive, updateTags } = tagsSlice.actions

export default tagsSlice.reducer