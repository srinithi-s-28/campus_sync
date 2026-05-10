import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    itemData: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.itemData = action.payload;
    },
  },
});

export const { setItems } = itemSlice.actions;
export default itemSlice.reducer;
