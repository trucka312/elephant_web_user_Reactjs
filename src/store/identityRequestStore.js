import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useIdentityRequestsStore = create((set) => ({
  certificate: [],
  identityRequest: {},
  identityRequestById: {},
  loading: false,
  addressList: [],
  paymentACcounts: [],
  loadingUpdate: false,
  loadingStatus: false,
  getIdentityRequest: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.identityRequest.getIdentityRequest();
      set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  updateIdentityRequest: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.updateIdentityRequest(params);
      set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  getIdentityRequestById: async ( id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.identityRequest.getIdentityRequestById(id);
      set({ identityRequestById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getAllAddressWarehouse: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.getAllAddressWarehouse(params);
      set({ addressList: response.data.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  addAddressWarehouse: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.addAddressWarehouse(params);
      // set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  updateAddressWarehouse: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.updateAddressWarehouse(id, params);
      // set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  deleteAddressWarehouse: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.deleteAddressWarehouse(params);
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },

  getAllPaymentAccount: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.getAllPaymentAccount();
      set({ paymentACcounts: response.data.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  addPaymentAccount: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.addPaymentAccount(params);
      // set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  deletePaymentAccount: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.deletePaymentAccount(id);
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  updateAccountPayment: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.updateAccountPayment(id, params);
      // set({ identityRequest: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingUpdate: false });
  },
  getAllCertificate: async ( onSuccess = () => {}, onFail = () => {}) => {
    try {
      // set({ loadingUpdate: true });
      const response = await RepositoryRemote.identityRequest.getAllCertificate();
      set({ certificate: response.data.data });
      onSuccess(response.data.data)
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }

    // set({ loadingUpdate: false });
  }
}));
