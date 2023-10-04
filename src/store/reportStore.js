import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useReportStore = create((set) => ({
  overview: {},
  topTenProduct: {},
  loading: false,
  getReportOverview: async (
    query,
    onSuccess = () => {},
    onFail = () => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.report.getReportOverview(query);
      set({ overview: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getTopTenProduct: async (
    query,
    onSuccess = () => {},
    onFail = () => {},
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.report.getTopTenProduct(query);
      set({ topTenProduct: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
