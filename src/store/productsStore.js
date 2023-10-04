import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useProductsStore = create((set) => ({
  products: {},
  recommendAttributes: [],
  productById: {},
  infoTable: {},
  loading: false,
  loadingById: false,
  loadingRecommend: false,
  forbiddenWords: [],
  historyImportFiles: [],
  loadingProductFile: false,
  getAllProducts: async (keyword, status, page, onSuccess = () => {}, onFail = () => {}, branchId,is_import_product) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.getAllProducts(keyword, status, page, branchId, is_import_product);
      set({ products: response.data.data.data });
      set({ infoTable: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getProductsById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      set({ productById: {} });
      const response = await RepositoryRemote.products.getProductsById(id);
      set({ productById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getRecommendAttributes: async (keyword, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingRecommend: true });
      const response = await RepositoryRemote.products.getRecommendAttributes(keyword);
      set({ recommendAttributes: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingRecommend: false });
  },
  createProduct: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingById: true });
      const response = await RepositoryRemote.products.createProduct(data);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingById: false });
  },
  updateProduct: async (id, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingById: true });
      const response = await RepositoryRemote.products.updateProduct(id, data);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingById: false });
  },
  deleteProduct: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((item) => item.id !== id),
      }));
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getAllForbiddenWord: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.products.getAllForbiddenWord();
      const forbiddenList =
        response.data.data && response.data.data.length && response.data.data.map((item) => item.text);
      set({ forbiddenWords: forbiddenList });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },
  getAllHistoryImportFiles: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.products.getAllHistoryImportFiles();
      set({
        historyImportFiles:
          response.data.data &&
          response.data.data.length &&
          response.data.data.map((item, index) => {
            return {
              key: index.toString(),
              ...item,
            };
          }),
      });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },
  pushSingleProductsFile: async (params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.products.pushSingleProductsFile(params);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },
  resetInitValue: () => {
    set({ productById: {} });
    set({ recommendAttributes: [] });
  },
  updateProductFiles: async (productIds, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingProductFile: true });
      const response = await RepositoryRemote.products.UpdateProductFiles(productIds);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingProductFile: false });
  } 
}));
