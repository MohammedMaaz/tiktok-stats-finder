import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TikTokState } from "./types";
import { StatsResponse } from "../../../common/types/api";

export const sliceName = "tiktok";

const initialState: TikTokState = {
  statsLoading: false,
  statsError: null,
  statsData: null,
};

export const tiktokSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    fetchStatsRequest(state) {
      state.statsError = initialState.statsError;
      state.statsLoading = true;
    },
    fetchStatsScucess(state, action: PayloadAction<StatsResponse>) {
      state.statsData = action.payload;
      state.statsError = initialState.statsError;
    },
    fetchStatsFailure(state, action) {
      state.statsError = action.payload;
      state.statsLoading = initialState.statsLoading;
    },
    setStatsLoading(state, action) {
      state.statsLoading = action.payload;
    },
  },
});

export default tiktokSlice.reducer;
