// import { getMeta, store_code } from "../ut: ",

export const constants = {
  DEFAULT_TITLE:
    "Xây dựng hệ thống bán hàng mạnh mẽ, mang thương hiệu của riêng bạn.",
  DEFAULT_HOME_TITLE: "Trang chủ",
  DEFAULT_ADDRESS: "Số 41, Ngõ 76, Phố Mai Dịch, Cầu Giấy, Hà Nội.",
  DEFAULT_PRODUCT_IMG: "/img/default_product.jpg",
  DEFAULT_SHORTCUT: "/img/default_shortcut.png",
  DEFAULT_HEADER_BACKGROUND_COLOR: "white",
  DEFAULT_HEADER_TEXT_COLOR: "#757575",
  DEFAULT_LOGO: "",
  DEFAULT_MAIL: "ikitech.vn@gmail.com",
  MAIN_PAGE_URL: "https://ikitech.vn/",
  DEFAULT_PHONE: "0246.0278.753",
  DEFAULT_COLOR: "#e62e04",
  LOADING_WHEN_SUBMIT_REGISTER: "LOADING_WHEN_SUBMIT_REGISTER",
  //STATUS
  // API_URL: getMeta("domain_api") + "/api",
  API_URL: "https://api-dev.hihihi.vn" + "/api",
  // STORE_CODE: store_code,
  STORE_CODE: 'chinhbv',
  HOST_SOCKET: "https://api-dev-chat.hihihi.vn:6442"
};

export const statusIdentity = {
  PROGRESSING : 0,
  UNAPPROVED : 1,
  APPROVED : 2
}

export const stepIdentityStatus = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
  INITIAL_VALUE: 3,
}

export const statusProduct = {
  PROGRESSING : 0,
  VIOLATION: 1,
  APPROVED : 2,
  UNAPPROVED : 3,
  DELETED: 4,
}