import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useOrderStore = create((set) => ({
  orders: {},
  orderExists: {},
  historyOrderById: {},
  tableInfo: {},
  perpage: {},
  loading: false,
  shippingCode: {},
  linkPDF: {},
  getAllOrders: async (
    keyword,
    page,
    status,
    start_date,
    end_date,
    payment_status_code,
    order_status_code,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getAllOrders(
        keyword,
        page,
        status,
        start_date,
        end_date,
        payment_status_code,
        order_status_code
      );
      set({ orders: response.data.data.data });
      set({ tableInfo: response.data.data });
      set({ perpage: response?.data?.data?.per_page });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getOrderById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getOrderById(id);
      set({ orderExists: response?.data?.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getHistoryOrderById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getHistoryOrderById(id);
      set({ historyOrderById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  changeOrderStatus: async (
    orderCode,
    status,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.changeOrderStatus(
        orderCode,
        { order_code: orderCode, order_status_code: status }
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  sendOrderToShipper: async (
    orderCode,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.sendOrderToShipper(
        orderCode,
        { order_code: orderCode}
      );
      set({shippingCode: response.data.data})
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getLinkPDF: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getLinkPDF(id);
      set({ linkPDF: response?.data?.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
}));
