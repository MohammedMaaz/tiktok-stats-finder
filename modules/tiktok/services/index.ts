import { APIResponse, StatsResponse } from "../../../common/types/api";
import axios from "../../../utils/api";

const fetchStats = (username: string): Promise<APIResponse<StatsResponse>> => {
  return axios(`/stats?username=${username}`);
};

const tiktokService = {
  fetchStats,
};

export default tiktokService;
