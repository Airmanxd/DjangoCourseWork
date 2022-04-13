import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTags: [],
  tags: [],
}

export const tagsSlice = createSlice({
  name: 'activeTags',
  initialState,
  reducers: {
    addToActive: (state, action) => {
      state.activeTags = [...state.activeTags, action.payload];
      state.tags.splice(state.tags.indexOf(action.payload), 1);
    },
    fillTags: (state, action) => {
      state.tags = action.payload;
    },
    removeFromActive: (state, action) => {
      console.log("remove payload", action.payload);
      console.log("state.activeTags", state.activeTags,
                    "state.tags", state.tags);
      state.tags.push(
        state.activeTags.splice(
          state.activeTags.indexOf(action.payload), 1)[0]);
      console.log("state.activeTags", state.activeTags,
                    "state.tags", state.tags);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addToActive, fillTags, removeFromActive } = tagsSlice.actions

export default tagsSlice.reducer