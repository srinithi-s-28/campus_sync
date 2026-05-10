import { createSlice } from "@reduxjs/toolkit"

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setMarketplaceItems: (state, action) => {
      state.items = action.payload
      state.loading = false
    },
    setMarketplaceLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setMarketplaceItems, setMarketplaceLoading } = marketplaceSlice.actions
export default marketplaceSlice.reducer
