import { callApi } from "../apis";

const getIdentityRequest = () => {
  return callApi(`/user/v1/sellers`, "get");
};

const updateIdentityRequest = (params) => {
  return callApi(`/user/v1/sellers`, "post", params);
};

const getIdentityRequestById = (id) => {
  return callApi(`/admin/v1/sellers/${id}`, "get");
};

const changeStatusIdentity = (id, params) => {
  return callApi(`/admin/v1/sellers/${id}/status`, "put", params);
};

const getAllAddressWarehouse = () => {
  return callApi('/user/v1/seller_warehouses', "get");
}

const addAddressWarehouse = (params) => {
  return callApi(`/user/v1/seller_warehouses`, "post", params);
}

const deleteAddressWarehouse = (params) => {
  return callApi(`/user/v1/seller_warehouses`, "delete", params);
}

const updateAddressWarehouse = (id, params) => {
  return callApi(`/user/v1/seller_warehouses/${id}`, "put", params);
}

const getAllPaymentAccount = () => {
  return callApi('/user/v1/seller_banks', "get");
}

const addPaymentAccount = (params) => {
  return callApi(`/user/v1/seller_banks`, "post", params);
}

const deletePaymentAccount = (id) => {
  return callApi(`/user/v1/seller_banks/${id}`, "delete");
}

const updateAccountPayment = (id, params) => {
  return callApi(`/user/v1/seller_banks/${id}`, "put", params);
}

const getAllCertificate = () => {
  return callApi(`/user/v1/certificate_policy_records`, "get");
}

export const identityRequest = {
  getIdentityRequest,
  getIdentityRequestById,
  updateIdentityRequest,
  changeStatusIdentity,
  addAddressWarehouse,
  getAllAddressWarehouse,
  deleteAddressWarehouse,
  updateAddressWarehouse,
  getAllPaymentAccount,
  addPaymentAccount,
  deletePaymentAccount,
  updateAccountPayment,
  getAllCertificate
};
