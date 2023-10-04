import { Col, Row, Table, Tabs, DatePicker, Tag, Button } from 'antd';
import ContentHeader from '../../components/content-header/index.jsx';
import { formatNumber } from '../../utils/index.js';
import { useFinanceStore } from '../../store/financeStore.js';
import { useEffect, useState } from 'react';
import { alerts } from '../../utils/alerts.js';
import { Link, useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const Finance = () => {
  // initial state
  const navigate = useNavigate();
  const { walletsInfor, loading, walletsHistory, getInfoWallets, getWalletsHistory, cancelRequestWithDrawMoney } = useFinanceStore();
  const [selectedDateRange, setSelectedDateRange] = useState([dayjs(), dayjs()]);
  const [tableHistoryParams, setTableHistoryParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    getInfoWallets(
      () => {},
      (err) => {
        alerts.error(err?.msg || 'Có lỗi xảy ra');
      },
    );
    const params = {
      start_date: tableHistoryParams.start_date,
      end_date: tableHistoryParams.end_date,
      page: tableHistoryParams.pagination.current,
    };
    getWalletsHistory(
      params,
      () => {
        
      },
      (err) => {
        alerts.error(err?.msg || 'Có lỗi xảy ra');
      },
    );
  }, [navigate, tableHistoryParams.pagination.current]);

  const handleDatePickerChange = (dates) => {
    if (dates) {
      setSelectedDateRange(dates);
      setTableHistoryParams({
        ...tableHistoryParams,
        start_date: dates[0]?.format(dateFormat),
        end_date: dates[1]?.format(dateFormat),
        pagination: {
          ...tableHistoryParams.pagination,
          current: 1,
        },
      });
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleTableChange = (pagination) => {
    setTableHistoryParams({
      ...tableHistoryParams,
      pagination: {
        ...tableHistoryParams.pagination,
        current: pagination.current,
      },
    });
  };

  const handleSearch = (tableHistoryParams) => {
    const params = {
      start_date: tableHistoryParams.start_date,
      end_date: tableHistoryParams.end_date,
      page: tableHistoryParams.pagination.current,
    };
    console.log('params',params)
    getWalletsHistory(
      params,
      () => {},
    );
  };

  const handleCancelRequest = (id) => {
    const params = {
      request_wallet_id : id
    }
    cancelRequestWithDrawMoney(params, () => {
      alerts.success("Hủy yêu cầu rút tiền thành công");
    },(err) => {
      alerts.error(err || 'có lỗi')
    })
  }

  // initial content for table "lịch sử thay đổi số dư"
  const columnChangeBalance = [
    {
      title: 'Số dư khả dụng',
      dataIndex: 'account_balance_changed',
      key: 'account_balance_changed',
      render: (_, record) => <span>{formatNumber(record?.account_balance_changed)}đ</span>,
    },
    {
      title: 'Số tiền',
      dataIndex: 'money_change',
      key: 'money_change',
      render: (_, record) => <span>{formatNumber(record?.money_change)}đ</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      key: 'type',
      render: (_, type) => {
        let colorType = (type) => {
          if (type == 1) {
            return '#27AE60';
          }
          if (type == 2) {
            return '#FFAA00';
          }
          if (type == 3) {
            return '#3383FD';
          }
          if (type == 4) {
            return '#E83A2F';
          }
          return '#486284';
        };
        const borderColor = colorType(type);
        const textColor = colorType(type);
        return (
          <>
            <Tag
              style={{
                fontSize: 14,
                height: 30,
                textAlign: 'center',
                paddingTop: 4,
                borderColor: borderColor,
                color: textColor,
              }}
            >
              {type == 1 ? 'Nạp tiền' : type == 2 ? 'Rút tiền' : type == 3 ? 'Tiền bán hàng' : 'Hoàn tiền'}
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // initial value for walestHistory table data
  let withdrawalHistoryDataTable = [];
  if (walletsHistory.length > 0) {
    withdrawalHistoryDataTable = walletsHistory.filter((item) => item.type === 2);
  }

  // initial content for table "lịch sử rút tiền"
  const columnsWithdrawMoney = [
    {
      title: 'Số dư khả dụng',
      dataIndex: 'account_balance_changed',
      key: 'account_balance_changed',
      render: (_, record) => <span>{formatNumber(record?.account_balance_changed)}đ</span>,
    },
    {
      title: 'Số tiền',
      dataIndex: 'money_change',
      key: 'money_change',
      render: (_, record) => <span>{formatNumber(record?.money_change)}đ</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // initial content for tab
  const itemsTab = [
    {
      key: '1',
      label: 'Lịch sử thay đổi số dư',
      children: (
        <Table
          dataSource={walletsHistory?.length ? walletsHistory : []}
          columns={columnChangeBalance}
          onChange={handleTableChange}
          loading={loading}
        />
      ),
    },
    {
      key: '2',
      label: 'Lịch sử rút tiền',
      children: <Table dataSource={withdrawalHistoryDataTable} columns={columnsWithdrawMoney} />,
    },
  ];

  return (
    // main layout
    <Row className="bg-[#f5f5f5]">
      <Col span={24}>
        {/* content top */}
        <Row className="bg-white block h-[300px]">
          <Row>
            <Col span={24} className="ml-[-30px]">
              <ContentHeader title="Tổng quan" />
            </Col>
          </Row>

          <Row className="mt-[70px] h-[20%]" loading={loading}>
            <Col span={8} className="items-center text-center text-[16px] font-semibold ">
              <p className="text-[#AB9C89]">Số dư</p>
              <p className="mt-3 text-[20px] font-bold text-[#333333]">
                {formatNumber(walletsInfor?.account_balance)}đ
              </p>
              <Button
                type="primary"
                className="mt-[10px] text-[12px] leading-[15px] text-white h-[25px] w-[100px] bg-[#21409a] pb-[5px]"
                onClick={() => navigate('/withdraw_money')}
              >
                Rút tiền
              </Button>
            </Col>
            <Col
              span={8}
              className="items-center text-center text-[16px] font-semibold border-[2px] border-solid border-[#f5f5f5] border-y-0"
            >
              <p className="text-[#AB9C89]">Đợi thanh toán</p>
              <p className="mt-3 text-[20px] font-bold text-[#33333]">
                {
                  formatNumber(walletsInfor?.total_money_waiting_payment)}
                đ
              </p>
              <Button
                type="primary"
                danger
                ghost
                className="mt-[10px] text-[12px] leading-[15px] text-red-500 h-[25px] w-[100px] bg-white border-red-500 border-solid border pb-[5px]"
                onClick={() => handleCancelRequest(walletsInfor?.list_request_wallet[0]?.id)}
              >
                Hủy rút
              </Button>
            </Col>
            <Col span={8} className="items-center text-center text-[16px] font-semibold ">
              <p className="text-[#AB9C89]">Đã thanh toán</p>
              <p className="mt-3 text-[20px] font-bold text-[#333333]">
                {formatNumber(walletsInfor?.total_money_paid)}đ
              </p>
            </Col>

            <Row className="mt-[40px] bg-[#f5f5f5] w-[96%] mx-auto h-[30px] items-cneter leading-[28px] px-[8px]">
              <Col span={24}>
                <div className="flex justify-between">
                  <span>Tài khoản ngân hàng của tôi :</span>
                  <Link to={'/bank_account'}>
                    Tài khoản ngân hàng <RightOutlined />
                  </Link>
                </div>
              </Col>
            </Row>
          </Row>
        </Row>

        {/* content bottom */}
        <Row className="mt-4 bg-white min-h-[520px] p-6">
          <Col span={24} className="pl-[15px]">
            <p className="text-[20px] font-semibold ">Chi tiết</p>

            {/* date picker area */}
            <div className="flex items-center">
              <RangePicker
                className="mt-[25px] mb-[10px]"
                defaultValue={selectedDateRange}
                format={dateFormat}
                onChange={handleDatePickerChange}
                disabledDate={disabledDate}
              />
              <Button
                type="primary"
                className="mt-[15px] text-[12px] leading-[15px] ml-4 text-white h-[30px] w-[100px] bg-[#21409a]"
                onClick={() => handleSearch(tableHistoryParams)}
              >
                Tìm kiếm
              </Button>
            </div>

            {/* tab area */}
            <Tabs defaultActiveKey="1" items={itemsTab} className="text-[16px]" size={'large'} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Finance;
