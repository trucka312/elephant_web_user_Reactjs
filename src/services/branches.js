import { callApi } from "../apis";

const getAllBranches = () => {
  return callApi(`/store/IZS/branches`, "get");
};

const updateBranches = (id, params) => {
  return callApi(`/store/IZS/branches/${id}`, "put", params);
};

const addBranches = (params) => {
  return callApi(`/store/IZS/branches`, "post", params);
};

const deleteBranches = (id) => {
  return callApi(`/store/IZS/branches/${id}`, "delete");
};

const updateBalance = (branchId, params) => {
  return callApi(`/store/v1/${branchId}/inventory/update_balance`, "put", params);
};

const getAllHistory = (branchId, params) => {
  return callApi(`/store/v1/${branchId}/inventory/history`, "put", params);
};

export const branches = {
  getAllBranches,
  updateBranches,
  addBranches,
  deleteBranches,
  updateBalance,
  getAllHistory
};
