import { callApi } from "../apis";

const getReportOverview = (query) => {
  return callApi(`/user/v1/report/overview${query ? query : '' }`, "get");
};

const getTopTenProduct = (query) => {
  return callApi(`/user/v1/report/top_ten_products${query ? query : '' }`, "get");
};

export const report = {
  getReportOverview,
  getTopTenProduct
};
