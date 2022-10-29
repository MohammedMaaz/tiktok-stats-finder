import { RootState } from "../../../store";

const statsLoading = (state: RootState) => state.tiktok.statsLoading;

const statsError = (state: RootState) => state.tiktok.statsError;

const statsData = (state: RootState) => state.tiktok.statsData;

export const tiktokSelectors = {
  statsLoading,
  statsError,
  statsData,
};
