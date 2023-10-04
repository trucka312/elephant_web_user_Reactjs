import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useVouchersStore = create((set) => ({
  vouchers: [],
  voucherById: {},
  vourchersEnd: [],
  loading: false,
  loadingById: false,
  getAllVouchers: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.getAllVouchers();
      set({ vouchers: response.data.data });
      // set({ loading: false });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  createVoucher: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.createVoucher(params);
      // set({ vouchers: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  deleteVoucher: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.deleteVoucher(id);
      set((prev) => ({...prev, vouchers: prev.vouchers.filter((item) => item.id !== id)}));
      onSuccess(response.data.data)
      
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateVoucher: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.updateVoucher(id, params);
      // set({ vouchers: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getVouchersById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ voucherById: {} });
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.getVouchersById(id);
      set({ voucherById: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getVourchersEnd: async (page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.vouchers.getAllVourcherEnd(page);
      set({ vourchersEnd: response.data?.data?.data });
      onSuccess(response.data?.data?.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
