import { callApi } from "../apis";

const getProvinces = () => {
  return callApi('/place/vn/province', "get");
};
const getDistrict = (id) => {
  return callApi(`/place/vn/district/${id}`, "get");
};
const getWards = (id) => {
  return callApi(`/place/vn/wards/${id}`, "get");
};

export const address = {
    getProvinces,
    getDistrict,
    getWards,
};