import { createAsyncThunk } from "@reduxjs/toolkit";
import { sliceName, tiktokSlice } from ".";
import { errors } from "../../../common/constants/error";
import { getSerializedError } from "../../../utils";
import tiktokService from "../services";

const fetchStats = createAsyncThunk(
  `${sliceName}/fetchStats`,
  async (
    { username, onSuccess }: { username: string; onSuccess?: () => void },
    { dispatch }
  ) => {
    dispatch(tiktokActions.fetchStatsRequest());
    try {
      const res = await tiktokService.fetchStats(username);
      if (!res.data.data) throw errors.NO_DATA;

      dispatch(tiktokActions.fetchStatsScucess(res.data.data));
      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      dispatch(tiktokActions.fetchStatsFailure(getSerializedError(error)));
    }
  }
);

export const tiktokActions = {
  fetchStats,
  ...tiktokSlice.actions,
};
