import { callApi } from "../apis"

const login = (form) => {
  return callApi(`/customer/v1/login_and_register`, "post", form);
};
const register = (form) => {
  return callApi(`/register`, "post", form);
};
const checkExists = (form) => {
  return callApi(`/customer/v1/login/check_exists`, "post", form);
};
const resetPassword = (form) => {
  return callApi(`/customer/v1/reset_password`, "post", form);
};
const sendOtp = (form) => {
  return callApi(`/send_otp`, "post", form);
};
const sendEmailOtp = (form) => {
  return callApi(`/send_email_otp`, "post", form);
};

const updateInfo = (form) => {
  return callApi(`/customer/v1/account`, 'put', form)
}

export const auth = {
  login,
  register,
  sendOtp,
  checkExists,
  resetPassword,
  sendEmailOtp,
  updateInfo,
};
