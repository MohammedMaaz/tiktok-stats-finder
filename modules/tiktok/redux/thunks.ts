import { createAsyncThunk } from "@reduxjs/toolkit";
import { sliceName, tiktokSlice } from ".";
import { getSerializedError } from "../../../utils";
import tiktokService from "../services";

const fetchStats = createAsyncThunk(
  `${sliceName}/fetchStats`,
  async (username: string, { dispatch }) => {
    dispatch(tiktokActions.fetchStatsRequest());
    try {
      const res = await tiktokService.fetchStats(username);
      if (!res.data) throw "Data not found";

      dispatch(tiktokActions.fetchStatsScucess(res.data));
    } catch (error) {
      dispatch(tiktokActions.fetchStatsFailure(getSerializedError(error)));
    }
  }
);

export const tiktokActions = {
  fetchStats,
  ...tiktokSlice.actions,
};
