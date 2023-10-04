import { callApi } from "../apis";

const getAllChatBox = () => {
  return callApi(`/user/v1/message_customers`, "get");
};

const getMessageListById = (id) => {
  return callApi(`/user/v1/message_customers/${id}?limit=100`, "get");
};

const sendMessageToCustomer = (id, params) => {
  return callApi(`/user/v1/message_customers/${id}`, "post", params);
};

export const chat = {
  getAllChatBox,
  getMessageListById,
  sendMessageToCustomer,
};
