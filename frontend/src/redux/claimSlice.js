import { createSlice } from "@reduxjs/toolkit";

const claimSlice = createSlice({
  name: "claim",
  initialState: {
    claimData: [],
    myClaimData: [],
  },
  reducers: {
    setClaims: (state, action) => {
      state.claimData = action.payload;
    },
    setMyClaims: (state, action) => {
      state.myClaimData = action.payload;
    },
  },
});

export const { setClaims, setMyClaims } = claimSlice.actions;
export default claimSlice.reducer;
