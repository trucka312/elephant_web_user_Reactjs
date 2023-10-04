import { ConfigProvider, DatePicker, Select, Spin } from "antd";
import viVN from "antd/locale/vi_VN";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useReportStore } from "../../store/reportStore";
import {
    getDateForChartHour,
    getDateForChartMonth,
    getDateForChartWeek,
    getDateForChartYear,
} from "../../utils/date";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

const initChartData = {
  labels: [],
  datasets: [
    {
      label: "Số lượng",
      data: [],
      backgroundColor: "#21409AE5",
    },
  ],
  nameTypeChart: "THÁNG NÀY",
  showDateTime: "hide",
  typeTop: "THEO-LUOT-XEM",
};

export default function TopProductChart() {
  const { loading, getTopTenProduct, topTenProduct } =
    useReportStore();
  const [dataCharts, setDataCharts] = useState(initChartData);
  console.log('dataCharts: ', dataCharts);

  useEffect(() => {
    if (topTenProduct) {
      loadData(topTenProduct);
    }
  }, [topTenProduct, dataCharts.typeTop]);

  const onchangeDate = (value) => {
    let date = "";
    switch (value) {
      case "HOM-NAY":
        setDataCharts((prev) => ({ ...prev, nameTypeChart: "HÔM NAY" }));
        date = getDateForChartHour();
        break;
      case "TUAN-NAY":
        setDataCharts((prev) => ({ ...prev, nameTypeChart: "TUẦN NÀY" }));
        date = getDateForChartWeek();
        break;
      case "THANG-NAY":
        setDataCharts((prev) => ({ ...prev, nameTypeChart: "THÁNG NÀY" }));
        date = getDateForChartMonth();
        break;
      case "NAM-NAY":
        setDataCharts((prev) => ({ ...prev, nameTypeChart: "NĂM NÀY" }));
        date = getDateForChartYear();
        break;
      case "TUY-CHINH":
        setDataCharts((prev) => ({ ...prev, nameTypeChart: "TÙY CHỈNH" }));
        return;
      default:
        break;
    }

    if (value !== "TUY-CHINH") {
      const query = `?date_from=${date.from}&date_to=${date.to}`;
      getTopTenProduct(query);
    }
  };

  const onchangeDateFromTo = (value) => {
      const from = value[0];
      const to = value[1];
    const query = `?date_from=${from}&date_to=${to}`;
    getTopTenProduct(query);
  };

  const loadData = (topten) => {
    let chartDataProps = { ...topten };
    let chartDataState = { ...dataCharts };
    let labels = [];
    let dataSets = [];
    let action = "total_price";
    let label = "Doanh thu";
    if (dataCharts.typeTop == "THEO-DOANH-THU") {
      action = "total_price";
      label = "Doanh thu";
    }
    if (dataCharts.typeTop == "THEO-SO-LUONG") {
      action = "total_items";
      label = "Số lượng";
    }
    if (dataCharts.typeTop == "THEO-SO-DON") {
      action = "number_of_orders";
      label = "Số đơn";
    }
    if (dataCharts.typeTop == "THEO-LUOT-XEM") {
      action = "view";
      label = "Lượt xem";
    }

    (chartDataProps[action] ?? []).forEach((item) => {
      dataSets.push(item[action]);
      if (item.product.name && item.product.name.length > 35)
        labels.push(item.product.name.slice(0, 35) + "...");
      else labels.push(item.product.name);
    });
    chartDataState.datasets[0].data = dataSets;
    chartDataState.labels = labels;
    chartDataState.datasets[0].label = label;
    setDataCharts(chartDataState);
  };

  const data = {
    labels: dataCharts.labels,
    datasets: dataCharts.datasets,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    indexAxis: "y",
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      title: {
        display: true,
        text: "Biểu đồ thống kê top 10 sản phẩm bán chạy",
        position: "bottom",
      },
    },
  };

  const optionDateSelect = [
    { value: "HOM-NAY", label: "Hôm nay" },
    { value: "TUAN-NAY", label: "Tuần này" },
    { value: "THANG-NAY", label: "Tháng này" },
    { value: "NAM-NAY", label: "Năm nay" },
    { value: "TUY-CHINH", label: "Tùy chỉnh" },
  ];

  const optionDataSelect = [
    { value: "THEO-DOANH-THU", label: "Theo doanh thu" },
    { value: "THEO-SO-LUONG", label: "Theo số lượng" },
    { value: "THEO-SO-DON", label: "Theo số đơn" },
    { value: "THEO-LUOT-XEM", label: "Theo lượt xem" },
  ];

  const { nameTypeChart } = dataCharts;

  return (
    <div className="p-10 py-5">
      <p className="text-[22px] text-[#21409A] font-medium">Top 10 sản phẩm</p>
      <div className="flex justify-between my-5 items-center">
        <p>
          TOP 10 HÀNG HÓA BÁN CHẠY{" "}
          {nameTypeChart !== "TÙY CHỈNH" ? nameTypeChart : ""}
          <Select
              onChange={(value) => setDataCharts((prev) => ({ ...prev, typeTop: value }))}
              defaultValue="THEO-LUOT-XEM"
              style={{ width: 200, marginLeft: 20 }}
              options={optionDataSelect}
            />
        </p>
        <div className="flex gap-3">
          <ConfigProvider locale={viVN}>
            <Select
              onChange={onchangeDate}
              defaultValue="THANG-NAY"
              style={{ width: 200 }}
              options={optionDateSelect}
            />
            <RangePicker
              placement={"bottomRight"}
              placeholder={["Từ ngày", "Đến ngày"]}
              onChange={(_, stringValue) => onchangeDateFromTo(stringValue)}
              disabled={nameTypeChart !== "TÙY CHỈNH" ? true : false}
            />
          </ConfigProvider>
        </div>
      </div>
      <Spin spinning={loading}>
        {topTenProduct.number_of_orders ? (
          <Bar data={data} options={options} />
        ) : null}
      </Spin>
    </div>
  );
}
