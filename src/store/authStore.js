import { create } from "zustand";
import { RepositoryRemote } from "../services";
import { removeToken } from "../utils/auth";

export const useAuthStore = create((set) => ({
  tokenInfo: {},
  loading: false,
  login: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.login(form);
      set({ tokenInfo: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  register: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.register(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  checkExists: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.checkExists(form);
      onSuccess(response?.data?.data);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  resetPassword: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.resetPassword(form);
      onSuccess(response?.data?.data);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendEmailOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.sendEmailOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  UpdateAcountAfterRegister: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.updateInfo(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  logOut : async (onSuccess, onFail) => {
    try {
      removeToken()
      localStorage.removeItem("profile")
      // localStorage.removeItem("badges")
      // localStorage.removeItem("cartInfo")
      set({tokenInfo: {}})
      onSuccess();
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
}));
