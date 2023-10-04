import { callApi } from "../apis";

const getInfoStore = () => {
  return callApi(`/user/v1/stores`, "get");
};

const updateInfoStore = (params) => {
  return callApi(`/user/v1/stores`, "put", params);
};

const updateInfoProfile = (params) => {
  return callApi(`/profile`, "put", params)
}

export const storeDataInfo = {
  getInfoStore,
  updateInfoStore,
  updateInfoProfile
};
