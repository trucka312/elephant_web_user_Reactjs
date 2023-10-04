import { callApi } from "../apis";

const getAllDiscounts = () => {
  return callApi("/store/v1/discounts", "get");
};

const createDiscount = (params) => {
  return callApi('/store/v1/discounts/', "post", params);
};

const deleteDiscount = (id) => {
  return callApi(`/store/v1/discounts/${id}`, "delete");
};

const updateDiscount = (id, params) => {
  return callApi(`/store/v1/discounts/${id}`, "put", params);
};

const getDiscountsById = (id) => {
  return callApi(`/store/v1/discounts/${id}`, "get");
};

const changeStatusDiscount = (id, params) => {
  return callApi(`/store/v1/discounts/${id}`, "put", params);
};

const getAllDisconutsEnd = (page) => {
  return callApi(`/store/v1/discounts_end?page=${page}`, "get");
}

export const discounts = {
  getAllDiscounts,
  getDiscountsById,
  changeStatusDiscount,
  createDiscount,
  deleteDiscount,
  updateDiscount,
  getAllDisconutsEnd,
};
