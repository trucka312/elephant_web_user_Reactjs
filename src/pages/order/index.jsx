import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Col, DatePicker, Input, Row, Select, Space, Table, Tag } from 'antd';
// import { PrinterOutlined } from '@ant-design/icons';

import { useOrderStore } from '../../store/orderStore.js';
import { formatNumber } from '../../utils/index.js';
const { Search } = Input;

export const Order = () => {
  // LOGIC UI
  const navigate = useNavigate();
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { orders, getAllOrders, loading, tableInfo } = useOrderStore();

  // table param
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
    keyword: '',
    status: '',
    start_date: '',
    end_date: '',
    payment_status_code: '',
    order_status_code: '',
  });
  // LOGIC IMPLEMENT
  // call api

  useEffect(() => {
    // get data from request
    fetchApi(tableParams.keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigate,
    tableParams.pagination.current,
    tableParams.end_date,
    tableParams.start_date,
    tableParams.status,
    tableParams.payment_status_code,
    tableParams.order_status_code,
  ]);

  // logic search
  const fetchApi = (keyword) => {
    const onSuccess = (response) => {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    };
    const onFail = (err) => {
      alert.error(err);
    };
    getAllOrders(
      keyword,
      tableParams.pagination.current || 1,
      tableParams.status,
      tableParams.start_date,
      tableParams.end_date,
      tableParams.payment_status_code,
      tableParams.order_status_code,
      onSuccess,
      onFail,
    );
  };

  // handle keyword change
  const onKeywordChange = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      keyword: value,
    });
  };

  // CUSTOMIZE ANTD CPN //
  // LOGIC UI ANTD

  // handle change select box create time
  const handleChangeSelectBox = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      status: value,
    });
  };

  // handle change date picker start date
  const onChangeStartDate = (_, dateString) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      start_date: dateString,
    });
  };

  // handle change date picker end date
  const onChangeEndDate = (_, dateString) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      end_date: dateString,
    });
  };

  // handle filter change for "Trạng thái thanh toán"
  const handlePaymentStatusFilter = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      payment_status_code: value,
    });
  };

  // handle filter change for "Trạng thái đơn hàng"
  const handleOrderStatusFilter = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      order_status_code: value,
    });
  };

  // initial table data
  // initial colums of data table
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, item, i) => <p>{i + 1}</p>,
    },
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'order_code',
      render: (_, record) => (
        <Link to={`/order/detail/${record?.order_code}`} style={{ color: 'blue' }}>
          {record?.order_code}
        </Link>
      ),
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch_name',
      key: 'branch_name',
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'name',
      key: 'name',
      render: (_, item, i) => <p key={i}>{item?.customer?.name}</p>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_final',
      key: 'total_final',
      render: (_, record) => <span>{formatNumber(record?.total_final)}đ</span>,
    },
    {
      title: 'Thời gian tạo đơn',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Trạng thái thanh toán' && (
        <Select
          defaultValue="Tất cả"
          style={{ minWidth: 180 }}
          onChange={handlePaymentStatusFilter}
          options={[
            {
              label: 'Tất cả',
              value: '',
            },
            {
              label: 'Chưa thanh toán',
              value: 'UNPAID',
            },
            {
              label: 'Đã thanh toán một phần',
              value: 'PARTIALLY_PAID',
            },
            {
              label: 'Đã thanh toán',
              value: 'PAID',
            },
            {
              label: 'Đã hoàn tiền',
              value: 'REFUNDS',
            },
          ]}
        />
      ),
      dataIndex: 'payment_status_name',
      key: 'payment_status_name',
      render: (_, { payment_status_name, payment_status_code }) => {
        let colorWithPaymentColor = (payment_status_code) => {
          if (payment_status_code == 'WAITING_FOR_PROGRESSING') {
            return 'yellow';
          }
          if (payment_status_code == 'UNPAID') {
            return 'red';
          }
          if (payment_status_code == 'PARTIALLY_PAID') {
            return 'orange';
          }
          if (payment_status_code == 'REFUNDS') {
            return 'black';
          }
          return 'green';
        };
        return (
          <>
            <Tag
              style={{ fontSize: 16, height: 30, textAlign: 'center', paddingTop: 4 }}
              color={colorWithPaymentColor(payment_status_code)}
            >
              {payment_status_name}
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Trạng thái đơn hàng' && (
        <Select
          defaultValue="Tất cả"
          style={{ minWidth: 160 }}
          onChange={handleOrderStatusFilter}
          options={[
            {
              label: 'Tất cả',
              value: '',
            },
            {
              label: 'Chờ xử lí',
              value: 'WAITING_FOR_PROGRESSING',
            },
            {
              label: 'Đang chuẩn bị hàng',
              value: 'PACKING',
            },
            {
              label: 'Hết hàng',
              value: 'OUT_OF_STOCK',
            },
            {
              label: 'Shop hủy',
              value: 'USER_CANCELLED',
            },
            {
              label: 'Khách đã hủy',
              value: 'CUSTOMER_CANCELLED',
            },
            {
              label: 'Đang giao hàng',
              value: 'SHIPPING',
            },
            {
              label: 'Đã nhận hàng',
              value: 'SHIPPER_DELIVERED',
            },
            {
              label: 'Lỗi giao hàng',
              value: 'DELIVERY_ERROR',
            },
            {
              label: 'Đã hoàn thành',
              value: 'COMPLETED',
            },
            {
              label: 'Chờ trả hàng',
              value: 'CUSTOMER_RETURNING',
            },
            {
              label: 'Đã trả hàng',
              value: 'CUSTOMER_HAS_RETURNS',
            },
          ]}
        />
      ),
      dataIndex: 'order_status_name',
      key: 'order_status_name',
      render: (_, { order_status_name, order_status_code }) => {
        let colorWithOrderStatusColor = (order_status_code) => {
          if (
            order_status_code == 'WAITING_FOR_PROGRESSING' ||
            order_status_code == 'PACKING' ||
            order_status_code == 'SHIPPING' ||
            order_status_code == 'WAIT_FOR_PAYMENT'
          ) {
            return 'orange';
          }
          if (
            order_status_code == 'DELIVERY_ERROR' ||
            order_status_code == 'DELIVERY_ERROR' ||
            order_status_code == 'CUSTOMER_CANCELLED' ||
            order_status_code == 'USER_CANCELLED' ||
            order_status_code == 'OUT_OF_STOCK'
          ) {
            return 'red';
          }
          if (
            order_status_code == 'REFUNDS' ||
            order_status_code == 'CUSTOMER_RETURNING' ||
            order_status_code == 'CUSTOMER_HAS_RETURNS'
          ) {
            return 'black';
          }

          return 'green';
        };
        return (
          <>
            <Tag
              style={{ fontSize: 16, height: 30, textAlign: 'center', paddingTop: 4 }}
              color={colorWithOrderStatusColor(order_status_code)}
            >
              {order_status_name}
            </Tag>
          </>
        );
      },
    },
  ];

  // initial selected row to show printer
  // const onSelectChange = (newSelectedRowKeys) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  // const hasSelected = selectedRowKeys.length > 0;

  //handle change table data
  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
      },
    });
  };

  return (
    <div className="bg-[#F8F9FC] pb-[10px]">
      {/* title page*/}
      <p className="text-[20px] font-medium pt-4 ml-8">Đơn hàng</p>

      {/* container header and body */}
      <div className=" pb-[20px] mx-8 my-8 bg-white">
        {/* header */}
        <div className="pt-[10px] pl-[30px] pb-[10px] ">
          {/* search and export area*/}
          <div className="flex justify-between">
            <div className="">
              <Search
                placeholder="Tìm mã đơn, tên, SĐT"
                keyword={tableParams.keyword}
                onChange={onKeywordChange}
                onSearch={fetchApi}
                enterButton
              />
            </div>
          </div>

          {/* date picker area */}
          <div className=" pt-[10px] w-full">
            <Space direction="horizontal">
              {/* select box */}
              <Select
                defaultValue="Thời gian tạo đơn"
                style={{
                  width: 228,
                }}
                onChange={handleChangeSelectBox}
                options={[
                  {
                    value: 'time_order',
                    label: 'Thời gian tạo đơn',
                  },
                  {
                    value: 'last_time_change_order_status',
                    label: 'Thời gian trạng thái cuối',
                  },
                ]}
              />

              {/* date picker start date */}
              <DatePicker style={{ width: 180 }} placeholder="Chọn ngày bắt đầu..." onChange={onChangeStartDate} />

              {/* date picker end date */}
              <DatePicker style={{ width: 180 }} placeholder="Chọn ngày kết thúc..." onChange={onChangeEndDate} />
            </Space>

            {/* total order */}
            <p className="pt-[20px] text-[14px]">
              Hóa đơn : <span className="text-red-600 text-[18px]">{tableInfo?.total}</span>{' '}
            </p>
          </div>
        </div>

        {/* body - table data */}
        <Row>
          <Col span={24}>
            <div className=" px-[20px] ">
              {/* {hasSelected ? (
                <Button type="primary" icon={<PrinterOutlined />} danger>
                  In {selectedRowKeys.length} đơn hàng
                </Button>
              ) : (
                ''
              )} */}

              {/* show table data */}
              <Table
                // rowSelection={rowSelection}
                dataSource={orders.length ? orders : []}
                columns={columns}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                loading={loading}
                style={{ marginTop: 10, textAlign: 'center'}}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
