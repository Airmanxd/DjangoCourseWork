import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

interface TagsState{
  activeTags: string[];
  tags: string[];
}

const initialState: TagsState = {
  activeTags: [],
  tags: [],
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addToActive: (state, action: PayloadAction<string>) => {
      state.activeTags = [...state.activeTags, action.payload];
    },
    fillTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    removeFromActive: (state, action: PayloadAction<string>) => {
        state.activeTags.splice(state.activeTags.indexOf(action.payload), 1);
    },
    updateTags: (state, action: PayloadAction<string[]>) => {
      state.tags = state.tags.concat(action.payload.filter( tag => !state.tags.includes(tag)));
    }
  }
})

// Action creators are generated for each case reducer function
export const { addToActive, fillTags, removeFromActive, updateTags } = tagsSlice.actions

export default tagsSlice.reducer