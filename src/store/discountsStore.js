import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useDiscountsStore = create((set) => ({
  discounts: [],
  discountsEnd: [],
  discountById: {},
  loading: false,
  loadingById: false,
  getAllDiscounts: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.discounts.getAllDiscounts();
      set({ discounts: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  createDiscount: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.discounts.createDiscount(params);
      // set({ discounts: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  deleteDiscount: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.discounts.deleteDiscount(id);
      set((prev) => ({...prev, discounts: prev.discounts.filter((item) => item.id !== id)}));
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateDiscount: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.discounts.updateDiscount(id, params);
      // set({ discounts: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getDiscountsById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ discountById: {} });
      set({ loading: true });
      const response = await RepositoryRemote.discounts.getDiscountsById(id);
      set({ discountById: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getDiscountsEnd: async (page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.discounts.getAllDisconutsEnd(page);
      set({ discountsEnd: response.data?.data?.data });
      onSuccess(response.data?.data?.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
