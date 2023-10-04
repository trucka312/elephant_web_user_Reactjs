import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useAddressStore = create((set) => ({
  loading: false,
  provinces: [],
  districts: [],
  wards: [],
  getProvinces: async (onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.address.getProvinces();
      localStorage.setItem("provinces", JSON.stringify(response.data.data));
      set({ provinces: response.data.data });
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  getDistrict: async (id, onFail) => {
    try {
      const response = await RepositoryRemote.address.getDistrict(id);
      set({ districts: response.data.data });
    } catch (error) {
      onFail(error);
    }
  },
  getWards: async (id, onFail) => {
    try {
      const response = await RepositoryRemote.address.getWards(id);
      set({ wards: response.data.data });
    } catch (error) {
      onFail(error);
    }
  },
  resetDistrictAndWard: async () => {
    set({ districts: [] });
    set({ wards: [] });
  },
}));
