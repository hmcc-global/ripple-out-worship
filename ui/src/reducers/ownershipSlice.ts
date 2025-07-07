import { createSlice } from '@reduxjs/toolkit';

export const ownershipSlice = createSlice({
  name: 'ownership',
  initialState: {},
  reducers: {
    fetchOwnership: (_, action) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const { fetchOwnership } = ownershipSlice.actions;

export default ownershipSlice.reducer;
