import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useInfoStore = create((set) => ({
  storeData: {},
  loading: true,
  userData: {},
  loadingUpdate: false,
  getInfoStore: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.storeDataInfo.getInfoStore();
      localStorage.setItem("profile", JSON.stringify(response.data.data));
      set({ storeData: response.data.data });
      set({ userData: response.data.data.user });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateInfoStore: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response =
      await RepositoryRemote.storeDataInfo.updateInfoStore(params);
      set({ storeData: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  updateInfoProfile: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response =
      await RepositoryRemote.storeDataInfo.updateInfoProfile(params);
      set({userData : response.data.data})
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
}));
