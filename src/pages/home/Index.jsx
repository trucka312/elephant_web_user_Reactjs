import { Col, Row } from "antd";
import { useEffect } from "react";
import {
  ArchivedIcon,
  BillIcon,
  DollarIcon,
  NoteIcon,
  ProductIcon,
} from "../../assets/icons";
import IdentityIcon from "../../assets/icons/IdentityIcon";
import { useBadgesStore } from "../../store/badgesStore";
import { Link } from "react-router-dom";
import IdentityDetail from "../identityRequest/Index";
import { useReportStore } from "../../store/reportStore";
import SaleReportChart from "./SaleReportChart";
import TopProductChart from "./TopProductChart";
import { getDateForChartMonth } from "../../utils/date";
import { formatNumber } from "../../utils";

export default function Home() {
  const { badges, getAllBadges } = useBadgesStore();
  const {getReportOverview, getTopTenProduct} = useReportStore()
  const {
    total_final_in_day,
    total_orders_in_day,
    orders_refunds,
    temporary_order,
    orders_waitting_for_progressing,
    orders_shipping,
    total_orders_completed_in_day,
    total_product_or_discount_nearly_out_stock
  } = badges;

  useEffect(() => {
    getAllBadges();
    const date = getDateForChartMonth();
    const query = `?date_from=${date.from}&date_to=${date.to}`;
    getReportOverview(query)
    getTopTenProduct(query)
  }, []);

  const badgeData = [
    {
      name: "DOANH THU NGÀY", 
      value: formatNumber(total_final_in_day),
      icon: <IdentityIcon className="text-[#5B93FF] w-[40px] h-[40px]" />,
      colorBgIcon: "#5B93FF33",
      path: "/identity-request",
    },
    {
      name: "ĐƠN HÀNG",
      value: formatNumber(total_orders_in_day),
      icon: <NoteIcon className="text-[#FFC327] w-[40px] h-[40px]" />,
      colorBgIcon: "#FFC32733",
      path: "",
    },
    {
      name: "ĐƠN HOÀN TRẢ",
      value: formatNumber(orders_refunds),
      icon: <ProductIcon className="text-[#FF8F6B] w-[40px] h-[40px]" />,
      colorBgIcon: "#FF8F6B33",
      path: "/products",
    },
    {
      name: "ĐƠN LƯU TẠM",
      value: formatNumber(temporary_order),
      icon: <BillIcon className="text-[#14B8A6] w-[40px] h-[40px]" />,
      colorBgIcon: "#5EE1DF33",
      path: "",
    },
    {
      name: "ĐƠN CHỜ XỬ LÝ",
      value: orders_waitting_for_progressing,
      icon: <ArchivedIcon className="text-[#CA0CC1] w-[40px] h-[40px]" />,
      colorBgIcon: "#CA0CC133",
      path: "/products/status/0",
    },
    {
      name: "ĐƠN ĐANG GIAO",
      value: orders_shipping,
      icon: <DollarIcon className="text-[#6366F1] w-[40px] h-[40px]" />,
      colorBgIcon: "#6366F133",
      path: "",
    },
    {
      name: "ĐƠN HOÀN THÀNH",
      value: total_orders_completed_in_day,
      icon: <DollarIcon className="text-[#6366F1] w-[40px] h-[40px]" />,
      colorBgIcon: "#6366F133",
      path: "",
    },
    {
      name: "SẢN PHẨM SẮP HẾT HÀNG",
      value: total_product_or_discount_nearly_out_stock,
      icon: <DollarIcon className="text-[#6366F1] w-[40px] h-[40px]" />,
      colorBgIcon: "#6366F133",
      path: "",
    },
  ];

  return (
    <div>
      <Link to="/identity-request">
        <IdentityDetail isHome={true} />
      </Link>
      <Row gutter={[15, 15]} className="bg-[#F5F5F5]">
        {badgeData.map((item) => {
          const { name, value, icon, colorBgIcon, path } = item;
          return (
            <Col span={6} key={name}>
              <Link to={path}>
                <div className="bg-white h-[114px] flex items-center gap-[20px] px-[20px] rounded-[10px] text-[#414141] hover:shadow-[0_0_14px_0px_rgba(22,119,255,0.3)] duration-300">
                  <div
                    className="p-[10px] rounded-full w-[50px] h-[50px] flex justify-center items-center"
                    style={{ backgroundColor: colorBgIcon }}
                  >
                    {icon}
                  </div>
                  <div className="flex flex-col justify-between h-[50px]">
                    <p className="text-[16px]">{name}</p>{" "}
                    <p className="font-medium text-[24px]">{value}</p>
                  </div>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>
      <div className="bg-[#F5F5F5] h-[15px]"></div>
      <SaleReportChart />
      <div className="bg-[#F5F5F5] h-[15px]"></div>
      <TopProductChart />
    </div>
  );
}
