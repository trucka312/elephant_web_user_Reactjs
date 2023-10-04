import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Layout, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDiscountsStore } from '../../store/discountsStore.js';
import { formatNumber } from '../../utils/index.js';
import { alerts } from '../../utils/alerts.js';
import { formatDate } from '../../utils/date.js';
import moment from 'moment';
import ModalYesNo from '../../components/common/Modal/ModalYesNo';

export default function DiscountProduct() {
  const navigate = useNavigate();
  const { discounts, loading, getAllDiscounts, deleteDiscount, getDiscountsEnd, discountsEnd } = useDiscountsStore(
    (state) => state,
  );
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  //initial table param
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleConfirmDelete = () => {
    if (voucherToDelete) {
      const onSuccess = () => {
        alerts.success('Xóa thành công');
        setIsDeleteModalVisible(false);
      };
      const onFail = (err) => {
        alerts.error(err);
        setIsDeleteModalVisible(false);
      };
      deleteDiscount(voucherToDelete.id, onSuccess, onFail);
    }
  };

  // handle select box change
  const handleChangeSelectBox = (value) => {
    let filteredVouchers = [];

    if (value === 'comming_soon') {
      filteredVouchers = discounts?.filter((voucher) => moment(voucher.start_time).isAfter(moment()));
    } else if (value === 'happenning') {
      filteredVouchers = discounts?.filter(
        (voucher) => moment(voucher.start_time).isSameOrBefore(moment()) && moment(voucher.end_time).isAfter(moment()),
      );
    } else if (value === 'end') {
      const onSuccess = () => {};
      const onFail = (err) => {
        alerts.error(err);
      };
      getDiscountsEnd(tableParams?.pagination.current || 1, onSuccess, onFail);
      setFilteredVouchers(discountsEnd);
    }

    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });

    // Set the filtered vouchers for display
    setFilteredVouchers(filteredVouchers);
  };

  const handleDeleteVoucher = (voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalVisible(true);
  };

  const vouchersTable = [
    {
      title: 'Tên giảm giá',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time) => {
        const startTime = moment(time);
        const now = moment();
        const isHappening = now.isSameOrAfter(startTime, 'minute'); 
        // Check if current time is happening or after start_time

        return (
          <p style={{ color: isHappening ? '#4fd74f' : '#333' }} >
            {formatDate(startTime, ' HH:mm DD/MM/yyyy').toLocaleString()}
          </p>
        );
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (time) => {
        const endTime = moment(time); // Convert end_time to a moment object
        const now = moment(); // Current time
        const expired = endTime.isBefore(now); // Check if voucher has expired

        const color = expired ? '#c51212' : '#4fd74f'; // Choose text color

        return (
          <p style={{ color }}>
            {formatDate(endTime, ' HH:mm DD/MM/yyyy').toLocaleString()}
          </p>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'products',
      dataIndex: 'products',
      render: (products) => (
        <div>
          {products.map((product, index) => (
            <p key={index}>
              {index > 0}
              {product.name}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'value',
      key: 'value',
      render: (voucher) => <p>{formatNumber(voucher) || 0}%</p>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (voucher) => {
        return (
          <Space size="middle">
            {/* <Link to={`/vouchers/${voucher.id}`}> */}
            <Tooltip title="Sửa" color={'#4e4ef0'}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/discount/${voucher.id}`, { state: voucher })}
              ></Button>
            </Tooltip>
            {/* </Link> */}
            <Tooltip title="Xóa" color={'#dc4a4a'}>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteVoucher(voucher)}
              ></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    getAllDiscounts(onSuccess, onFail);
  }, []);

  useEffect(() => {
    if (discounts && discounts.length) {
      const filteredVouchersData = discounts.filter(
        (voucher) => moment(voucher.start_time).isSameOrBefore(moment()) && moment(voucher.end_time).isAfter(moment()),
      );
      setFilteredVouchers(filteredVouchersData);
    }
  }, [discounts]);

  return (
    <Layout.Content className="mt-4 px-5">
      <div className="flex justify-between items-center">
        <p className="my-4 font-semibold text-[20px] mt-[-55px]">Giảm giá sản phẩm</p>

        <div className="flex flex-col align-middle items-end">
          <Link to="/discount/create">
            <Button type="primary">Tạo giảm giá mới</Button>
          </Link>

          {/* selectbox area */}
          <Select
            defaultValue="Đang diễn ra"
            className="my-4"
            style={{
              width: 228,
            }}
            onChange={handleChangeSelectBox}
            options={[
              {
                value: 'happenning',
                label: 'Đang diễn ra',
              },
              {
                value: 'comming_soon',
                label: 'Sắp diễn ra',
              },
              {
                value: 'end',
                label: 'Đã kết thúc',
              },
            ]}
          />
        </div>
      </div>

      <ModalYesNo
        title="Xóa giảm giá"
        text="Bạn có chắc muốn xóa không? Hành động này sẽ không thể hoàn tác."
        handleVisible={isDeleteModalVisible}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
      />

      <Table
        columns={vouchersTable}
        scroll={{ x: true }}
        size="middle"
        bordered
        dataSource={filteredVouchers?.length ? filteredVouchers : discountsEnd}
        loading={loading}
      />
    </Layout.Content>
  );
}
