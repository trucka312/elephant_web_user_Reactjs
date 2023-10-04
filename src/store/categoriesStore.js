import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useCategoriesStore = create((set) => ({
  categories: {},
  recommendCategory: [],
  loading: false,
  loadingRecommend: false,
  getAllCategories: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.getAllCategories();
      localStorage.setItem("categories", JSON.stringify(response.data.data))
      set({ categories: response.data.data });
      set({ infoTable: response.data.data }); 
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getRecommendCategory: async (keyword, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingRecommend: true });
      const response = await RepositoryRemote.categories.getRecommendCategory(keyword);
      set({ recommendCategory: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingRecommend: false });
  },
  
}));