import Axios from "axios";
import { API_BASE_URL } from "../common/constants/api";
import * as rax from "retry-axios";

const axios = Axios.create({
  baseURL: API_BASE_URL,
});

//retry requests on Network or 5xx errors
rax.attach(axios);

export default axios;
