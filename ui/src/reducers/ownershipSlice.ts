import { createSlice } from '@reduxjs/toolkit';

export const ownershipSlice = createSlice({
  name: 'ownership',
  initialState: {},
  reducers: {
    fetchOwnership: (_, action) => {
      return action.payload;
    },
  },
});

export const { fetchOwnership } = ownershipSlice.actions;

export default ownershipSlice.reducer;
