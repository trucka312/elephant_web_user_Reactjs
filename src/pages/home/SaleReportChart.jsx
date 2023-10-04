import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useReportStore } from "../../store/reportStore";
import { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { formatNumber } from "../../utils/index.js";
import {
  getDateForChartHour,
  getDateForChartMonth,
  getDateForChartWeek,
  getDateForChartYear,
} from "../../utils/date";
import { ConfigProvider, DatePicker, Select, Spin } from "antd";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";

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
      label: "Doanh thu",
      data: [],
      backgroundColor: "#21409AE5",
    },
  ],
  nameTypeChart: "THÁNG NÀY",
};

export default function SaleReportChart() {
  const chartRef = useRef(null);
  const chart = chartRef.current;

  const { getReportOverview, overview, loading } = useReportStore();
  const [dataCharts, setDataCharts] = useState(initChartData);

  useEffect(() => {
    if (overview) {
      loadData(overview);
    }
  }, [overview]);

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
      getReportOverview(query);
    }
  };

  const onchangeDateFromTo = (value) => {
    let from = "";
    let to = "";
    try {
      // from = moment(value[0], "DD-MM-YYYY").format("YYYY-MM-DD")
      // to = moment(value[1], "DD-MM-YYYY").format("YYYY-MM-DD")
      from = value[0];
      to = value[1];
    } catch (error) {
      let date = getDateForChartMonth();
    }
    const query = `?date_from=${from}&date_to=${to}`;
    getReportOverview(query);
  };

  const loadData = (overview) => {
    let time = "";
    let parseNumberTime = 0;
    let chartDataProps = overview;
    let chartDataState = { ...dataCharts };
    let labels = [];
    let dataSets = [];
    (chartDataProps?.data_prime_time?.charts ?? []).forEach((item) => {
      dataSets.push(item.total_final);
      if (chartDataProps.data_prime_time.type_chart == "hour") {
        time = moment(item.time, "YYYY-MM-DD HH:mm:ss").format("HH");
        parseNumberTime = Number(time) + "h";
        labels.push(parseNumberTime);
      } else if (chartDataProps.data_prime_time.type_chart == "day") {
        time = moment(item.time, "YYYY-MM-DD").format("DD/MM");
        labels.push(time);
      } else if (chartDataProps.data_prime_time.type_chart == "month") {
        time = moment(item.time, "YYYY-MM").format("MM/YYYY");
        parseNumberTime = time;
        labels.push(parseNumberTime);
      }
    });
    chartDataState.datasets[0].data = dataSets;
    chartDataState.labels = labels;
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
        callback: function (value) {
          return value;
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu của cửa hàng",
        position: "bottom",
      },
    },
    animation: {
      // easing: "easeOutBounce",
      duration: 2000
    },
  };

  const optionDateSelect = [
    { value: "HOM-NAY", label: "Hôm nay" },
    { value: "TUAN-NAY", label: "Tuần này" },
    { value: "THANG-NAY", label: "Tháng này" },
    { value: "NAM-NAY", label: "Năm nay" },
    { value: "TUY-CHINH", label: "Tùy chỉnh" },
  ];

  const { nameTypeChart } = dataCharts;
  let totalFinal =
    typeof overview.data_prime_time != "undefined"
      ? formatNumber(Number(overview.data_prime_time.total_final))
      : 0;
  return (
    <div className="p-10 py-5 ">
      <p className="text-[22px] text-[#21409A] font-medium">
        Báo cáo doanh thu
      </p>
      <div className="flex justify-between my-5 items-center">
        <p>
          DOANH THU {nameTypeChart !== "TÙY CHỈNH" ? nameTypeChart : ""}
          <span className="text-[#21409A] pl-[10px] font-medium">
            {totalFinal} đ
          </span>
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
        {overview?.data_prime_time ? (
          <Bar data={data} options={options} ref={chartRef} />
        ) : null }
      </Spin>
    </div>
  );
}
