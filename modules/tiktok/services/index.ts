import { APIResponse, StatsResponse } from "../../../common/types/api";
import axios from "../../../utils/api";
import { AxiosPromise } from "axios";

const fetchStats = (
  username: string
): AxiosPromise<APIResponse<StatsResponse>> => {
  return axios(`/stats?username=${username}`);
};

const tiktokService = {
  fetchStats,
};

export default tiktokService;
