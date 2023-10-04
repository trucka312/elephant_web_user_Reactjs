import PropTypes from "prop-types";
import {
  DashboardOutlined,
  FileDoneOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Link, useNavigate } from "react-router-dom";
import {
  FinanceIcon,
  OrderIcon,
  ProductIcon,
  SettingIcon,
  VoucherIcon,
} from "../../assets/icons";
import LOGO from "../../assets/images/logo.svg";
import { StyledLogo, StyledSidebar } from "./Sidebar.style";

const Sidebar = ({ collapsed }) => {
  const badges = JSON.parse(localStorage.getItem("badges"));
  const path = window.location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("beforeunload", () => {});
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [navigate]);

  if (!badges) return null;

  const {
    product_progressing,
    product_approved,
    product_delete,
    product_unapproved,
    product_violation,
    voucher_total,
    products_discount,
    total_products,
  } = badges;

  const menuSidebar = [
    {
      key: "/",
      icon: <DashboardOutlined style={{ color: "#4595ef" }} />,
      label: (
        <Link className="flex justify-between" to="">
          Tổng quan
        </Link>
      ),
    },
    {
      key: "/order",
      icon: <OrderIcon style={{ color: "#4595ef" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="order">
          Đơn hàng
        </Link>
      ),
    },
    {
      key: "/identity-request",
      icon: <FileDoneOutlined style={{ color: "#9a10d0" }} />,
      label: (
        <Link className="flex justify-between" to="identity-request">
          Thông tin định danh
        </Link>
      ),
    },
    {
      key: "products",
      icon: <ProductIcon style={{ color: "#ff6900" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Sản phẩm
        </Link>
      ),
      children: [
        {
          key: "/products",
          label: (
            <Link className="flex justify-between" to="/products">
              Tất cả{" "}
              <div>
                ( <span className="font-medium">{total_products}</span> )
              </div>
            </Link>
          ),
        },
        {
          key: "/products/status/2",
          label: (
            <Link
              className="flex justify-between text-[#27AE60]"
              to="/products/status/2"
              style={{ color: "#27AE60" }}
            >
              Đang hiển thị{" "}
              <div>
                ( <span className="font-medium">{product_approved}</span> )
              </div>
            </Link>
          ),
        },
        {
          key: "/products/status/0",
          label: (
            <Link
              className="flex justify-between"
              to="/products/status/0"
              style={{ color: "#218ECB" }}
            >
              Cần duyệt{" "}
              <div>
                ( <span className="font-medium">{product_progressing}</span> )
              </div>
            </Link>
          ),
        },
        {
          key: "/products/status/1",
          label: (
            <Link
              className="flex justify-between"
              to="/products/status/1"
              style={{ color: "#E83A2F" }}
            >
              Vi phạm{" "}
              <div>
                ( <span className="font-medium">{product_violation}</span> )
              </div>
            </Link>
          ),
        },
        {
          key: "/products/status/3",
          label: (
            <Link
              className="flex justify-between"
              to="/products/status/3"
              style={{ color: "#F0AD00" }}
            >
              Từ chối{" "}
              <div>
                ( <span className="font-medium">{product_unapproved}</span> )
              </div>
            </Link>
          ),
        },
        {
          key: "/products/status/4",
          label: (
            <Link
              className="flex justify-between"
              to="/products/status/4"
              style={{ color: "#FF833D" }}
            >
              Đã xóa{" "}
              <div>
                ( <span className="font-medium">{product_delete}</span> )
              </div>
            </Link>
          ),
        },
      ],
    },
    {
      key: "/inventory",
      icon: <FileDoneOutlined style={{ color: "#9a10d0" }} />,
      label: "Kho",
      children: [
        {
          key: "/product-inventory",
          label: (
            <Link className="flex justify-between" to="product-inventory">
              Tồn kho sản phẩm
            </Link>
          ),
        },
        {
          key: "/branches",
          label: (
            <Link className="flex justify-between" to="/branches">
              Danh sách kho
            </Link>
          ),
        },
      ],
    },
    {
      key: "/chat",
      icon: <WechatOutlined style={{ color: "#9a10d0" }} />,
      label: (
        <Link className="flex justify-between" to="chat">
          Chat với khách hàng
        </Link>
      ),
    },
    {
      key: "/vouchers",
      icon: <VoucherIcon style={{ color: "red" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Chương trình khuyến mại
        </Link>
      ),
      children: [
        // for vourcher discount product
        {
          key: "2",
          label: (
            <Link
              className="flex justify-between text-[#27AE60]"
              to="/discounts"
              style={{ color: "#27AE60" }}
            >
              Giảm giá sản phẩm
              <div>
                ( <span className="font-medium">{products_discount}</span> )
              </div>
            </Link>
          ),
        },
        // for vourcher discount bill
        {
          key: "3",
          label: (
            <Link
              className="flex justify-between text-[#3341da]"
              to="vouchers"
              style={{ color: "#3341da" }}
            >
              Vourcher
              <div>
                ( <span className="font-medium">{voucher_total}</span> )
              </div>
            </Link>
          ),
        },
      ],
    },
    {
      key: "/finance",
      icon: <FinanceIcon style={{ color: '#8a3ec4' }} className="w-[16px]"/>,
      label: (
        <Link className="flex justify-between" to={path}>
          Tài chính
        </Link>
      ),
        children: [
          {
            key: "/finance",
            label: (
              <Link className="flex justify-between" to="/finance">
                Thông tin số dư
              </Link>
            ),
          },
          {
            key: "/withdraw_money",
            label: (
              <Link className="flex justify-between" to="/withdraw_money">
                Thực hiện rút tiền
              </Link>
            ),
          },
          {
            key: "/bank_account",
            label: (
              <Link className="flex justify-between" to="/bank_account">
                Tài khoản ngân hàng
              </Link>
            ),
          },
        ]
    },
    {
      key: "/settings",
      icon: <SettingIcon style={{ color: "#3341da" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Cài đặt chung
        </Link>
      ),
      children: [
        {
          key: "/store-info",
          label: (
            <Link className="flex justify-between" to="/store-info">
              Thông tin cửa hàng
            </Link>
          ),
        },
        // {
        //   key: "/store-address",
        //   label: (
        //     <Link className="flex justify-between" to="/store-address">
        //       Địa chỉ cửa hàng
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings1',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Ngôn ngữ
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings2',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Tiền tệ
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings3',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Phân quyền
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings4',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Hình thức vận chuyển
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings5',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Hình thức thanh toán
        //     </Link>
        //   ),
        // },
        // {
        //   key: 'subSettings6',
        //   label: (
        //     <Link className="flex justify-between" to="/#">
        //       Danh mục sản phẩm
        //     </Link>
        //   ),
        // },
      ],
    },
  ];

  return (
    <StyledSidebar
      trigger={null}
      collapsible
      collapsed={!collapsed}
      width={300}
      theme="light"
    >
      <StyledLogo>
        <img
          src={LOGO}
          alt="logo cms"
          width={!collapsed ? 35 : 100}
          height={35}
        />
      </StyledLogo>
      <Scrollbars
        style={{ height: "calc(100vh - 64px)" }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <Menu
          items={menuSidebar}
          theme="light"
          mode="inline"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          style={{
            margin: "16px 0",
            minHeight: "100vh - 80px",
            background: "#fff",
          }}
        />
      </Scrollbars>
    </StyledSidebar>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
