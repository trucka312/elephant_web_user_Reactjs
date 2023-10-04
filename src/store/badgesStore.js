import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useBadgesStore = create((set) => ({
  badges: {},
  loading: false,
  getAllBadges: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.badges.getAllBadges();
      localStorage.setItem("badges", JSON.stringify(response.data.data))
      set({ badges: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
