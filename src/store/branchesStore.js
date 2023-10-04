import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useBranchesStore = create((set, get) => ({
  infoTable: {},
  loading: false,
  loadingUpdate: false,
  branches: [],
  getAllBranches: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.branches.getAllBranches();
      set({ branches: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateBranches: async (
    id,
    params,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.branches.updateBranches(
        id,
        params
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  addBranches: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.branches.addBranches(params);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  deleteBranches: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.branches.deleteBranches(id);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateBalance: async (
    branchId,
    params,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.branches.updateBalance(
        branchId,
        params
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  getAllHistory: async (
    branchId,
    params,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.branches.getAllHistory(
        branchId,
        params
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
}));
