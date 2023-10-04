import { callApi } from "../apis";

const RequestWithDrawMoney = (params) => {
  return callApi("/user/v1/request_wallets", "post", params);
}

const GetInfoWallets = () => {
  return callApi("/user/v1/wallets", "get");
}

const CancelRequestWallets = (id) => {
  return callApi("/user/v1/request_wallets/cancel", "put", id);
}

const GetHistoryWallets = (params) => {
  return callApi(`/user/v1/history_wallets?${params?.start_date ? `from_time=${params?.start_date}` : ''}${params?.end_date ? `&to_time=${params?.end_date}` : ''}${params?.pagination ? `&page=${params?.pagination}` : ''}`, "get");
}

const GetAllBankExsits = () => {
  return callApi("/user/v1/banks", "get");
}

const GetAllBankAccounts = () => {
  return callApi("/user/v1/seller_banks","get");
}

const GetInforOneBankAccount = (id) => {
  return callApi(`/user/v1/seller_banks${id}`, "get");
}

const AddBankAccount = (params) => {
  return callApi("/user/v1/seller_banks", "post", params);
}

const DeleteBankAccount = (id, params) => {
  return callApi(`/user/v1/seller_banks/${id}`, "delete", params);
}

const UpdateBankAccount = (id, params) => {
  return callApi(`/user/v1/seller_banks/${id}`,"put", params)
}

export const finance = {
  RequestWithDrawMoney,
  GetInfoWallets,
  GetHistoryWallets,
  CancelRequestWallets,
  
  GetAllBankExsits,
  GetAllBankAccounts,
  GetInforOneBankAccount,
  AddBankAccount,
  DeleteBankAccount,
  UpdateBankAccount
}