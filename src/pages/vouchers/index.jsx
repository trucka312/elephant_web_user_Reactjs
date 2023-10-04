import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Layout, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi'; // Import the Vietnamese locale for moment

import { useVouchersStore } from '../../store/vouchersStore.js';
import { formatNumber } from '../../utils';
import { alerts } from '../../utils/alerts';
import { formatDate } from '../../utils/date';
import ModalYesNo from '../../components/common/Modal/ModalYesNo';

export default function Vouchers() {
  const navigate = useNavigate();
  const { vouchers, vourchersEnd, loading, getAllVouchers, deleteVoucher, getVourchersEnd } = useVouchersStore(
    (state) => state,
  );

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
      deleteVoucher(voucherToDelete.id, onSuccess, onFail);
    }
  };

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    getAllVouchers(onSuccess, onFail);
  }, []);

  useEffect(() => {
    if (vouchers && vouchers.length) {
      const filteredVouchersData = vouchers.filter(
        (voucher) => moment(voucher.start_time).isSameOrBefore(moment()) && moment(voucher.end_time).isAfter(moment()),
      );
      setFilteredVouchers(filteredVouchersData);
    }
  }, [vouchers]);

  const [filteredVouchers, setFilteredVouchers] = useState([]);

  // handle select box change
  const handleChangeSelectBox = (value) => {
    let filteredVouchers = [];

    if (value === 'comming_soon') {
      filteredVouchers = vouchers?.filter((voucher) => moment(voucher.start_time).isAfter(moment()));
    } else if (value === 'happenning') {
      filteredVouchers = vouchers?.filter(
        (voucher) => moment(voucher.start_time).isSameOrBefore(moment()) && moment(voucher.end_time).isAfter(moment()),
      );
    } else if (value === 'end') {
      const onSuccess = () => {};
      const onFail = (err) => {
        alerts.error(err);
      };
      getVourchersEnd(tableParams?.pagination.current || 1, onSuccess, onFail);
      setFilteredVouchers(vourchersEnd);
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

  const vouchersTable = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Code',
      key: 'code',
      dataIndex: 'code',
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
          <p style={{ color: isHappening ? '#4fd74f' : '#333' }}>
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

        const color = expired ? '#e14c4c' : '#4fd74f'; // Choose text color

        return (
          <p style={{ color }} >
            {formatDate(new Date(time), ' HH:mm DD/MM/yyyy').toLocaleString()}
          </p>
        );
      },
    },
    {
      title: 'Đơn đạt tối thiểu',
      dataIndex: 'value_limit_total',
      key: 'value_limit_total',
      render: (voucher) => <p>{formatNumber(voucher) || 0}đ</p>,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'value_discount',
      key: 'value_discount',
      render: (_, voucher) => {
        const { discount_type, value_discount } = voucher;
        return (
          <p>
            {formatNumber(value_discount)}
            {!discount_type ? 'đ' : '%'}
          </p>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (voucher) => {
        return (
          <Space size="middle">
            <Tooltip title="Sửa" color={'#6262f0'}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/vouchers/${voucher.id}`, { state: voucher })}
              ></Button>
            </Tooltip>
            {/* </Link> */}
            <Tooltip title="Xóa" color={'#f64b4b'}>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                // onClick={() => handleDeleteVoucher(voucher.id)}
                onClick={() => handleDeleteVoucher(voucher)}
              ></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleDeleteVoucher = (voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalVisible(true);
  };

  return (
    <Layout.Content className="mt-4 px-5">
      <div className="flex justify-between items-center">
        <p className="my-4 font-semibold text-[20px] mt-[-55px]">Danh sách Vouchers</p>
        <div className="flex flex-col align-middle items-end">
          <Link to="/vouchers/create">
            <Button type="primary">Tạo voucher mới</Button>
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
        title="Xóa Vourcher"
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
        dataSource={filteredVouchers?.length ? filteredVouchers : vourchersEnd}
        loading={loading}
      />
    </Layout.Content>
  );
}
