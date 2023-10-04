import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useFinanceStore = create((set, get) => ({
  walletsInfor : {},
  responseCancelRequestWallets : {},
  listBankExits : [],
  walletsHistory : [],
  allBankAccounts : [],
  aBankAccount : {},
  loading: false,
  requestWithDrawMoney: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.RequestWithDrawMoney(params);
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getInfoWallets: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.GetInfoWallets();
      set({ walletsInfor: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  cancelRequestWithDrawMoney: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.CancelRequestWallets(id);
      set({responseCancelRequestWallets : response.data});
      onSuccess(response.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getWalletsHistory: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.GetHistoryWallets(params);
      set({walletsHistory : response.data.data.data});
      onSuccess(response.data.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getAllBankExsits: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.GetAllBankExsits();
      set({listBankExits : response.data.data});
      onSuccess(response.data.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getAllBankAccounts: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.GetAllBankAccounts();
      set({allBankAccounts : response.data.data.data});
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getOneBAnkAccount: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.GetInforOneBankAccount(id);
      set({aBankAccount : response.data.data});
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  AddBAnkAccount: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.AddBankAccount(params);
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  DeleteBankAccount: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.DeleteBankAccount(id);
      set((prev) => ({...prev, allBankAccounts: prev.allBankAccounts.filter((item) => item.id !== id)}));
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  UpdateBankAccount: async (id ,params , onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.finance.UpdateBankAccount(id ,params);
      const updatedIndex = get().allBankAccounts.findIndex(item => item.id === params.id);
      if (updatedIndex !== -1) {
        const updatedAllBankAccounts = [...get().allBankAccounts];
        updatedAllBankAccounts[updatedIndex] = response.data.data;
        set({ allBankAccounts: updatedAllBankAccounts });
      }
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
