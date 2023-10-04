import { callApi } from '../apis/index.jsx';

const getAllOrders = (keyword, page, status, start_date, end_date, payment_status_code, order_status_code) => {
  return callApi(
    `/store/v1/orders?search=${keyword}&page=${page}${end_date ? `&time_to=${end_date}` : ''}${
      start_date ? `&time_form=${start_date}` : ''
    }${status ? `&type_query_time=${status}` : ''}${
      payment_status_code ? `&payment_status_code=${payment_status_code}` : ''
    }${order_status_code ? `&order_status_code=${order_status_code}` : ''}`,
    'get',
  );
};

const getOrderById = (id) => {
  return callApi(`/store/v1/orders/${id}`, "get");
};

const getHistoryOrderById = (id) => {
  return callApi(`/store/v1/orders/status_records/${id}`, "get");
}

const changeOrderStatus = (orderCode, body) => {
  return callApi(`/store/v1/orders/change_order_status`, "post", body);
}

const sendOrderToShipper = (orderCode, body) => {
  return callApi(`/store/v1/shipper/send_order`, "post", body);
}

const getLinkPDF = (id) => {
  return callApi(`/user/v1/print_bills/${id}`,'get');
}

export const orders = {
  getAllOrders,
  getOrderById,
  getHistoryOrderById,
  changeOrderStatus,
  sendOrderToShipper,
  getLinkPDF,
};

