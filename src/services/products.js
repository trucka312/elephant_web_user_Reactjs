import { callApi } from "../apis";

const getAllProducts = (keyword, status, page, branchId, is_import_product) => {
  return callApi(
    `/store/v1/products?${keyword && `search=${keyword}`}${
      page && `&page=${page}`
    }${status && `&status=${status}`}${
      branchId !== undefined ? `&branch_ids=${branchId}${is_import_product && `&is_import_product=${is_import_product}`}` : ""
    }`,
    "get"
  );
};

const getRecommendAttributes = (keyword) => {
  return callApi(
    `/store/v1/get_recommend_attributes${
      keyword ? `?category_name=${keyword}` : ""
    }`,
    "get"
  );
};

const getProductsById = (id) => {
  return callApi(`/store/v1/products/${id}`, "get");
};

const createProduct = (data) => {
  return callApi(`/store/v1/products`, "post", data);
};

const updateProduct = (id, data) => {
  return callApi(`/store/v1/products/${id}`, "put", data);
};

const deleteProduct = (id) => {
  return callApi(`/store/v1/products/${id}`, "delete");
};

const getAllForbiddenWord = () => {
  return callApi(`/user/v1/word_forbiddens`, "get");
};

const getAllHistoryImportFiles = () => {
  return callApi('/user/v1/products/import_excel', 'get');
}

const pushSingleProductsFile = (params) => {
  return callApi('/user/v1/products/import_excel_item', 'post', params);
}

const UpdateProductFiles = (productIds) => {
  return callApi(`/store/v1/products`, "put", productIds);
}

export const products = {
  getAllProducts,
  getProductsById,
  getRecommendAttributes,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllForbiddenWord,
  getAllHistoryImportFiles,
  pushSingleProductsFile,
  UpdateProductFiles
};
