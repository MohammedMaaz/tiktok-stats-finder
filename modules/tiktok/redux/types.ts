import { StatsResponse } from "../../../common/types/api";

export type TikTokState = {
  statsLoading: boolean;
  statsError: string | null;
  statsData: StatsResponse | null;
};
