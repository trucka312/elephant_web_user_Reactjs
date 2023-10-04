import { callApi } from "../apis";

const getAllCategories = () => {
  return callApi(`/user/v1/categories`, "get");
};

const getRecommendCategory = (keyword) => {
    return callApi(`/store/v1/get_recommend_category?name=${keyword}`, "get");
  };

export const categories = {
  getAllCategories,
  getRecommendCategory
};
